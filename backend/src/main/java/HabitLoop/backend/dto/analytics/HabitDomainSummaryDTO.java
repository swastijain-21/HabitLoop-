package HabitLoop.backend.dto.analytics;

public class HabitDomainSummaryDTO {
    private int totalHabits;
    private int activeHabits;
    private Double completionPercentage;
    private Integer currentStreak;
    private Integer longestStreak;
    private String recentCompletionTrend;

    public HabitDomainSummaryDTO() {}

    public HabitDomainSummaryDTO(int totalHabits, int activeHabits, Double completionPercentage,
                                 Integer currentStreak, Integer longestStreak, String recentCompletionTrend) {
        this.totalHabits = totalHabits;
        this.activeHabits = activeHabits;
        this.completionPercentage = completionPercentage;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.recentCompletionTrend = recentCompletionTrend;
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

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public String getRecentCompletionTrend() {
        return recentCompletionTrend;
    }

    public void setRecentCompletionTrend(String recentCompletionTrend) {
        this.recentCompletionTrend = recentCompletionTrend;
    }
}
