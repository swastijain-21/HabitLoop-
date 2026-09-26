package HabitLoop.backend.dto.analytics;

import java.util.List;

public class HabitSummaryDTO {
    private Long userId;
    private int totalHabits;
    private int activeHabits;
    private int inactiveHabits;
    private int completedToday;
    private int incompleteToday;
    private Double completionPercentageToday;
    private Double weeklyCompletionPercentage;
    private List<HabitAnalyticsDTO> habits;
    private List<DailyCompletionDTO> recentDailyCompletions;
    private String overallTrend;

    public HabitSummaryDTO() {}

    public HabitSummaryDTO(Long userId, int totalHabits, int activeHabits, int inactiveHabits,
                           int completedToday, int incompleteToday, Double completionPercentageToday,
                           Double weeklyCompletionPercentage, List<HabitAnalyticsDTO> habits,
                           List<DailyCompletionDTO> recentDailyCompletions, String overallTrend) {
        this.userId = userId;
        this.totalHabits = totalHabits;
        this.activeHabits = activeHabits;
        this.inactiveHabits = inactiveHabits;
        this.completedToday = completedToday;
        this.incompleteToday = incompleteToday;
        this.completionPercentageToday = completionPercentageToday;
        this.weeklyCompletionPercentage = weeklyCompletionPercentage;
        this.habits = habits;
        this.recentDailyCompletions = recentDailyCompletions;
        this.overallTrend = overallTrend;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getTotalHabits() {
        return totalHabits;
    }

    public void setTotalHabits(int totalHabits) {
        this.totalHabits = totalHabits;
    }

    public int getActiveHabits() {
        return activeHabits;
    }

    public void setActiveHabits(int activeHabits) {
        this.activeHabits = activeHabits;
    }

    public int getInactiveHabits() {
        return inactiveHabits;
    }

    public void setInactiveHabits(int inactiveHabits) {
        this.inactiveHabits = inactiveHabits;
    }

    public int getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(int completedToday) {
        this.completedToday = completedToday;
    }

    public int getIncompleteToday() {
        return incompleteToday;
    }

    public void setIncompleteToday(int incompleteToday) {
        this.incompleteToday = incompleteToday;
    }

    public Double getCompletionPercentageToday() {
        return completionPercentageToday;
    }

    public void setCompletionPercentageToday(Double completionPercentageToday) {
        this.completionPercentageToday = completionPercentageToday;
    }

    public Double getWeeklyCompletionPercentage() {
        return weeklyCompletionPercentage;
    }

    public void setWeeklyCompletionPercentage(Double weeklyCompletionPercentage) {
        this.weeklyCompletionPercentage = weeklyCompletionPercentage;
    }

    public List<HabitAnalyticsDTO> getHabits() {
        return habits;
    }

    public void setHabits(List<HabitAnalyticsDTO> habits) {
        this.habits = habits;
    }

    public List<DailyCompletionDTO> getRecentDailyCompletions() {
        return recentDailyCompletions;
    }

    public void setRecentDailyCompletions(List<DailyCompletionDTO> recentDailyCompletions) {
        this.recentDailyCompletions = recentDailyCompletions;
    }

    public String getOverallTrend() {
        return overallTrend;
    }

    public void setOverallTrend(String overallTrend) {
        this.overallTrend = overallTrend;
    }
}
