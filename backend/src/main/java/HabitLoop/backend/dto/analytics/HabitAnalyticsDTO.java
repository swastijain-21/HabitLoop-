package HabitLoop.backend.dto.analytics;

public class HabitAnalyticsDTO {
    private Long habitId;
    private String habitName;
    private String category;
    private Double targetValue;
    private String unit;
    private long totalLogs;
    private long completedLogs;
    private long incompleteLogs;
    private Double completionRatePercentage;
    private int currentStreak;
    private int longestStreak;
    private String trend;

    public HabitAnalyticsDTO() {}

    public HabitAnalyticsDTO(Long habitId, String habitName, String category, Double targetValue, String unit,
                             long totalLogs, long completedLogs, long incompleteLogs,
                             Double completionRatePercentage, int currentStreak, int longestStreak, String trend) {
        this.habitId = habitId;
        this.habitName = habitName;
        this.category = category;
        this.targetValue = targetValue;
        this.unit = unit;
        this.totalLogs = totalLogs;
        this.completedLogs = completedLogs;
        this.incompleteLogs = incompleteLogs;
        this.completionRatePercentage = completionRatePercentage;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.trend = trend;
    }

    // Getters and Setters
    public Long getHabitId() {
        return habitId;
    }

    public void setHabitId(Long habitId) {
        this.habitId = habitId;
    }

    public String getHabitName() {
        return habitName;
    }

    public void setHabitName(String habitName) {
        this.habitName = habitName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public long getTotalLogs() {
        return totalLogs;
    }

    public void setTotalLogs(long totalLogs) {
        this.totalLogs = totalLogs;
    }

    public long getCompletedLogs() {
        return completedLogs;
    }

    public void setCompletedLogs(long completedLogs) {
        this.completedLogs = completedLogs;
    }

    public long getIncompleteLogs() {
        return incompleteLogs;
    }

    public void setIncompleteLogs(long incompleteLogs) {
        this.incompleteLogs = incompleteLogs;
    }

    public Double getCompletionRatePercentage() {
        return completionRatePercentage;
    }

    public void setCompletionRatePercentage(Double completionRatePercentage) {
        this.completionRatePercentage = completionRatePercentage;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }
}
