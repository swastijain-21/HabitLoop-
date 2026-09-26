package HabitLoop.backend.service;

import HabitLoop.backend.dto.DashboardResponse;
import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitCompletion;
import HabitLoop.backend.entity.MoodEntry;
import HabitLoop.backend.repository.HabitCompletionRepository;
import HabitLoop.backend.repository.HabitRepository;
import HabitLoop.backend.repository.MoodEntryRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final HabitRepository habitRepository;
    private final HabitCompletionRepository habitCompletionRepository;
    private final MoodEntryRepository moodEntryRepository;

    public DashboardService(UserRepository userRepository,
                            HabitRepository habitRepository,
                            HabitCompletionRepository habitCompletionRepository,
                            MoodEntryRepository moodEntryRepository) {
        this.userRepository = userRepository;
        this.habitRepository = habitRepository;
        this.habitCompletionRepository = habitCompletionRepository;
        this.moodEntryRepository = moodEntryRepository;
    }

    public Optional<DashboardResponse> getDashboardData(Long userId) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }

        LocalDate today = LocalDate.now();

        // 1. Total & Active Habits
        List<Habit> habits = habitRepository.findByUserId(userId);
        long totalHabits = habits.size();
        long activeHabits = habits.stream()
                .filter(habit -> Boolean.TRUE.equals(habit.getActive()))
                .count();

        // 2. Completions for user's habits
        List<HabitCompletion> completions = habits.isEmpty()
                ? Collections.emptyList()
                : habitCompletionRepository.findByHabitIn(habits);

        long totalCompletions = completions.size();
        long completedToday = completions.stream()
                .filter(completion -> today.equals(completion.getCompletionDate()))
                .count();

        // 3. Current & Longest Streaks
        Set<LocalDate> completionDates = completions.stream()
                .map(HabitCompletion::getCompletionDate)
                .collect(Collectors.toSet());

        int currentStreak = calculateCurrentStreak(completionDates, today);
        int longestStreak = calculateLongestStreak(completionDates);

        // 4. Mood Statistics & Trend
        List<MoodEntry> moods = moodEntryRepository.findByUserId(userId);
        double averageMood = 0.0;
        if (!moods.isEmpty()) {
            double rawAvg = moods.stream()
                    .mapToInt(MoodEntry::getMoodScore)
                    .average()
                    .orElse(0.0);
            averageMood = Math.round(rawAvg * 100.0) / 100.0;
        }

        List<DashboardResponse.MoodTrendItem> moodTrend = moods.stream()
                .sorted(Comparator.comparing(MoodEntry::getEntryDate))
                .map(entry -> new DashboardResponse.MoodTrendItem(entry.getEntryDate(), entry.getMoodScore()))
                .toList();

        // 5. Habit Completion Rate for the last 7 days
        double habitCompletionRate = 0.0;
        if (activeHabits > 0) {
            LocalDate sevenDaysAgo = today.minusDays(6);
            long completionsLast7Days = completions.stream()
                    .filter(c -> !c.getCompletionDate().isBefore(sevenDaysAgo) && !c.getCompletionDate().isAfter(today))
                    .count();
            double expectedCompletions = activeHabits * 7.0;
            double rawRate = (completionsLast7Days / expectedCompletions) * 100.0;
            habitCompletionRate = Math.min(100.0, Math.round(rawRate * 100.0) / 100.0);
        }

        DashboardResponse response = new DashboardResponse(
                totalHabits,
                activeHabits,
                completedToday,
                totalCompletions,
                currentStreak,
                longestStreak,
                averageMood,
                moodTrend,
                habitCompletionRate
        );

        return Optional.of(response);
    }

    private int calculateCurrentStreak(Set<LocalDate> completionDates, LocalDate today) {
        int streak = 0;
        LocalDate date = today;
        while (completionDates.contains(date)) {
            streak++;
            date = date.minusDays(1);
        }
        return streak;
    }

    private int calculateLongestStreak(Set<LocalDate> completionDates) {
        if (completionDates.isEmpty()) {
            return 0;
        }

        List<LocalDate> sortedDates = completionDates.stream()
                .sorted()
                .toList();

        int maxStreak = 0;
        int current = 0;
        LocalDate prev = null;

        for (LocalDate date : sortedDates) {
            if (prev == null) {
                current = 1;
            } else if (date.equals(prev.plusDays(1))) {
                current++;
            } else if (!date.equals(prev)) {
                current = 1;
            }

            if (current > maxStreak) {
                maxStreak = current;
            }
            prev = date;
        }

        return maxStreak;
    }
}
