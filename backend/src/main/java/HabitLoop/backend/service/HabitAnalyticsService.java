package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.DailyCompletionDTO;
import HabitLoop.backend.dto.analytics.HabitAnalyticsDTO;
import HabitLoop.backend.dto.analytics.HabitSummaryDTO;
import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitLog;
import HabitLoop.backend.repository.HabitLogRepository;
import HabitLoop.backend.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HabitAnalyticsService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final AnalyticsCalculationHelper calcHelper;

    public HabitAnalyticsService(HabitRepository habitRepository,
                                 HabitLogRepository habitLogRepository,
                                 AnalyticsCalculationHelper calcHelper) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.calcHelper = calcHelper;
    }

    public HabitSummaryDTO getUserHabitSummary(Long userId, LocalDate referenceDate) {
        if (userId == null) {
            return new HabitSummaryDTO();
        }
        LocalDate targetDate = referenceDate != null ? referenceDate : LocalDate.now();

        List<Habit> allHabits = habitRepository.findByUserId(userId);
        List<Habit> activeHabits = allHabits.stream().filter(Habit::isActive).toList();

        int totalCount = allHabits.size();
        int activeCount = activeHabits.size();
        int inactiveCount = totalCount - activeCount;

        // Daily completion for targetDate
        List<HabitLog> todayLogs = habitLogRepository.findByUserIdAndLogDate(userId, targetDate);
        Set<Long> completedHabitIdsToday = todayLogs.stream()
                .filter(HabitLog::isCompleted)
                .map(log -> log.getHabit().getId())
                .collect(Collectors.toSet());

        int completedToday = 0;
        for (Habit h : activeHabits) {
            if (completedHabitIdsToday.contains(h.getId())) {
                completedToday++;
            }
        }
        int incompleteToday = activeCount - completedToday;
        Double completionPctToday = activeCount > 0
                ? calcHelper.round(((double) completedToday / activeCount) * 100.0, 2)
                : 0.0;

        // Individual Habit Analytics
        List<HabitAnalyticsDTO> habitAnalyticsList = new ArrayList<>();
        for (Habit h : allHabits) {
            habitAnalyticsList.add(getIndividualHabitAnalytics(h));
        }

        // Weekly daily completion points (past 7 days ending on targetDate)
        List<DailyCompletionDTO> dailyCompletions = getWeeklyDailyCompletions(userId, activeHabits, targetDate);

        // Overall weekly completion percentage
        int totalWeeklyScheduled = dailyCompletions.stream().mapToInt(DailyCompletionDTO::getTotalScheduled).sum();
        int totalWeeklyCompleted = dailyCompletions.stream().mapToInt(DailyCompletionDTO::getCompletedCount).sum();
        Double weeklyCompletionPct = totalWeeklyScheduled > 0
                ? calcHelper.round(((double) totalWeeklyCompleted / totalWeeklyScheduled) * 100.0, 2)
                : 0.0;

        // Overall trend from daily points
        List<Double> dailyPercentages = dailyCompletions.stream()
                .map(DailyCompletionDTO::getCompletionPercentage)
                .toList();
        String overallTrend = calcHelper.determineTrend(dailyPercentages);

        return new HabitSummaryDTO(
                userId, totalCount, activeCount, inactiveCount,
                completedToday, incompleteToday, completionPctToday,
                weeklyCompletionPct, habitAnalyticsList, dailyCompletions, overallTrend
        );
    }

    public HabitAnalyticsDTO getIndividualHabitAnalytics(Habit habit) {
        if (habit == null) {
            return new HabitAnalyticsDTO();
        }
        List<HabitLog> logs = habitLogRepository.findByHabitIdOrderByLogDateAsc(habit.getId());

        long totalLogs = logs.size();
        long completedLogs = logs.stream().filter(HabitLog::isCompleted).count();
        long incompleteLogs = totalLogs - completedLogs;

        Double completionRate = totalLogs > 0
                ? calcHelper.round(((double) completedLogs / totalLogs) * 100.0, 2)
                : 0.0;

        int currentStreak = calculateCurrentStreak(logs);
        int longestStreak = calculateLongestStreak(logs);

        // Trend based on chronological completion (1.0 for completed, 0.0 for incomplete)
        List<Double> completionValues = logs.stream()
                .map(l -> l.isCompleted() ? 100.0 : 0.0)
                .toList();
        String trend = calcHelper.determineTrend(completionValues);

        Double targetVal = habit.getTargetValue() != null ? habit.getTargetValue().doubleValue() : 1.0;

        return new HabitAnalyticsDTO(
                habit.getId(), habit.getName(), habit.getCategory(), targetVal, habit.getUnit(),
                totalLogs, completedLogs, incompleteLogs, completionRate,
                currentStreak, longestStreak, trend
        );
    }

    public List<DailyCompletionDTO> getWeeklyDailyCompletions(Long userId, List<Habit> activeHabits, LocalDate endDate) {
        List<DailyCompletionDTO> list = new ArrayList<>();
        LocalDate startDate = endDate.minusDays(6);

        List<HabitLog> weekLogs = habitLogRepository.findByUserIdAndLogDateBetween(userId, startDate, endDate);
        Map<LocalDate, Set<Long>> completedByDate = new HashMap<>();

        for (HabitLog log : weekLogs) {
            if (log.isCompleted()) {
                completedByDate.computeIfAbsent(log.getLogDate(), k -> new HashSet<>())
                        .add(log.getHabit().getId());
            }
        }

        int scheduled = activeHabits.size();
        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            Set<Long> completedSet = completedByDate.getOrDefault(d, Collections.emptySet());
            int completedCount = 0;
            for (Habit h : activeHabits) {
                if (completedSet.contains(h.getId())) {
                    completedCount++;
                }
            }
            int incompleteCount = Math.max(0, scheduled - completedCount);
            Double pct = scheduled > 0
                    ? calcHelper.round(((double) completedCount / scheduled) * 100.0, 2)
                    : 0.0;
            list.add(new DailyCompletionDTO(d, scheduled, completedCount, incompleteCount, pct));
        }
        return list;
    }

    private int calculateCurrentStreak(List<HabitLog> logs) {
        if (logs == null || logs.isEmpty()) {
            return 0;
        }
        // Group by date and check latest logs
        Map<LocalDate, Boolean> completionMap = new HashMap<>();
        for (HabitLog l : logs) {
            completionMap.put(l.getLogDate(), l.isCompleted());
        }

        List<LocalDate> sortedDates = completionMap.keySet().stream()
                .sorted(Comparator.reverseOrder())
                .toList();

        if (sortedDates.isEmpty()) {
            return 0;
        }

        LocalDate mostRecent = sortedDates.get(0);
        // If the most recent log is not completed, streak is 0
        if (!Boolean.TRUE.equals(completionMap.get(mostRecent))) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = mostRecent;

        for (LocalDate date : sortedDates) {
            if (date.equals(expectedDate)) {
                if (Boolean.TRUE.equals(completionMap.get(date))) {
                    streak++;
                    expectedDate = expectedDate.minusDays(1);
                } else {
                    break;
                }
            } else {
                // Gap in dates breaks the streak
                break;
            }
        }
        return streak;
    }

    private int calculateLongestStreak(List<HabitLog> logs) {
        if (logs == null || logs.isEmpty()) {
            return 0;
        }
        Map<LocalDate, Boolean> completionMap = new HashMap<>();
        for (HabitLog l : logs) {
            completionMap.put(l.getLogDate(), l.isCompleted());
        }

        List<LocalDate> sortedDates = completionMap.keySet().stream()
                .sorted()
                .toList();

        int longest = 0;
        int current = 0;
        LocalDate previousDate = null;

        for (LocalDate date : sortedDates) {
            boolean completed = Boolean.TRUE.equals(completionMap.get(date));
            if (completed) {
                if (previousDate != null && date.equals(previousDate.plusDays(1))) {
                    current++;
                } else {
                    current = 1;
                }
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
            previousDate = date;
        }
        return longest;
    }
}
