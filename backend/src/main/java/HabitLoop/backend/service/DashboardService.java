package HabitLoop.backend.service;

import HabitLoop.backend.dto.DashboardResponse;
import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitCompletion;
import HabitLoop.backend.entity.MoodEntry;
import HabitLoop.backend.entity.HabitLog;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.repository.HabitCompletionRepository;
import HabitLoop.backend.repository.HabitLogRepository;
import HabitLoop.backend.repository.HabitRepository;
import HabitLoop.backend.repository.MoodEntryRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final HabitRepository habitRepository;
    private final HabitCompletionRepository habitCompletionRepository;
    private final MoodEntryRepository moodEntryRepository;
    private final HabitLogRepository habitLogRepository;
    private final MoodLogRepository moodLogRepository;

    public DashboardService(UserRepository userRepository,
                            HabitRepository habitRepository,
                            HabitCompletionRepository habitCompletionRepository,
                            MoodEntryRepository moodEntryRepository,
                            HabitLogRepository habitLogRepository,
                            MoodLogRepository moodLogRepository) {
        this.userRepository = userRepository;
        this.habitRepository = habitRepository;
        this.habitCompletionRepository = habitCompletionRepository;
        this.moodEntryRepository = moodEntryRepository;
        this.habitLogRepository = habitLogRepository;
        this.moodLogRepository = moodLogRepository;
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

        // 2. Completions: Combine legacy HabitCompletion and canonical HabitLog
        List<HabitCompletion> legacyCompletions = habits.isEmpty()
                ? Collections.emptyList()
                : habitCompletionRepository.findByHabitIn(habits);

        List<HabitLog> canonicalLogs = habitLogRepository.findByUserId(userId);

        Set<String> uniqueHabitDateCompletions = new HashSet<>();
        Set<LocalDate> completionDates = new HashSet<>();
        long completedToday = 0;

        for (HabitCompletion c : legacyCompletions) {
            String key = c.getHabit().getId() + "_" + c.getCompletionDate();
            uniqueHabitDateCompletions.add(key);
            completionDates.add(c.getCompletionDate());
            if (today.equals(c.getCompletionDate())) {
                completedToday++;
            }
        }

        for (HabitLog log : canonicalLogs) {
            if (log.isCompleted()) {
                String key = log.getHabit().getId() + "_" + log.getLogDate();
                if (uniqueHabitDateCompletions.add(key)) {
                    completionDates.add(log.getLogDate());
                    if (today.equals(log.getLogDate())) {
                        completedToday++;
                    }
                }
            }
        }

        long totalCompletions = uniqueHabitDateCompletions.size();

        // 3. Current & Longest Streaks
        int currentStreak = calculateCurrentStreak(completionDates, today);
        int longestStreak = calculateLongestStreak(completionDates);

        // 4. Mood Statistics & Trend: Combine canonical MoodLog and legacy MoodEntry
        List<MoodLog> canonicalMoods = moodLogRepository.findByUserId(userId);
        List<MoodEntry> legacyMoods = moodEntryRepository.findByUserId(userId);

        Map<LocalDate, Integer> moodScoresByDate = new TreeMap<>();
        for (MoodEntry m : legacyMoods) {
            moodScoresByDate.put(m.getEntryDate(), m.getMoodScore());
        }
        for (MoodLog m : canonicalMoods) {
            moodScoresByDate.put(m.getLogDate(), m.getScore());
        }

        double averageMood = 0.0;
        if (!moodScoresByDate.isEmpty()) {
            double rawAvg = moodScoresByDate.values().stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0.0);
            averageMood = Math.round(rawAvg * 100.0) / 100.0;
        }

        List<DashboardResponse.MoodTrendItem> moodTrend = moodScoresByDate.entrySet().stream()
                .map(e -> new DashboardResponse.MoodTrendItem(e.getKey(), e.getValue()))
                .toList();

        // 5. Habit Completion Rate for the last 7 days
        double habitCompletionRate = 0.0;
        if (activeHabits > 0) {
            LocalDate sevenDaysAgo = today.minusDays(6);
            long completionsLast7Days = 0;
            for (String key : uniqueHabitDateCompletions) {
                int underscoreIndex = key.lastIndexOf('_');
                if (underscoreIndex != -1) {
                    LocalDate date = LocalDate.parse(key.substring(underscoreIndex + 1));
                    if (!date.isBefore(sevenDaysAgo) && !date.isAfter(today)) {
                        completionsLast7Days++;
                    }
                }
            }
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
