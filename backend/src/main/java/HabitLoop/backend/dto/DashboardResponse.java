package HabitLoop.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class DashboardResponse {

    private long totalHabits;
    private long activeHabits;
    private long completedToday;
    private long totalCompletions;
    private int currentStreak;
    private int longestStreak;
    private double averageMood;
    private List<MoodTrendItem> moodTrend;
    private double habitCompletionRate;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalHabits, long activeHabits, long completedToday, long totalCompletions,
                             int currentStreak, int longestStreak, double averageMood,
                             List<MoodTrendItem> moodTrend, double habitCompletionRate) {
        this.totalHabits = totalHabits;
        this.activeHabits = activeHabits;
        this.completedToday = completedToday;
        this.totalCompletions = totalCompletions;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.averageMood = averageMood;
        this.moodTrend = moodTrend;
        this.habitCompletionRate = habitCompletionRate;
    }

    public long getTotalHabits() {
        return totalHabits;
    }

    public void setTotalHabits(long totalHabits) {
        this.totalHabits = totalHabits;
    }

    public long getActiveHabits() {
        return activeHabits;
    }

    public void setActiveHabits(long activeHabits) {
        this.activeHabits = activeHabits;
    }

    public long getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(long completedToday) {
        this.completedToday = completedToday;
    }

    public long getTotalCompletions() {
        return totalCompletions;
    }

    public void setTotalCompletions(long totalCompletions) {
        this.totalCompletions = totalCompletions;
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

    public double getAverageMood() {
        return averageMood;
    }

    public void setAverageMood(double averageMood) {
        this.averageMood = averageMood;
    }

    public List<MoodTrendItem> getMoodTrend() {
        return moodTrend;
    }

    public void setMoodTrend(List<MoodTrendItem> moodTrend) {
        this.moodTrend = moodTrend;
    }

    public double getHabitCompletionRate() {
        return habitCompletionRate;
    }

    public void setHabitCompletionRate(double habitCompletionRate) {
        this.habitCompletionRate = habitCompletionRate;
    }

    public static class MoodTrendItem {
        private LocalDate date;
        private Integer moodScore;

        public MoodTrendItem() {
        }

        public MoodTrendItem(LocalDate date, Integer moodScore) {
            this.date = date;
            this.moodScore = moodScore;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public Integer getMoodScore() {
            return moodScore;
        }

        public void setMoodScore(Integer moodScore) {
            this.moodScore = moodScore;
        }
    }
}
