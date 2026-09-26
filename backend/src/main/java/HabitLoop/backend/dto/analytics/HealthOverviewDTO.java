package HabitLoop.backend.dto.analytics;

import java.time.LocalDate;

public class HealthOverviewDTO {
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private SleepAnalyticsDTO sleep;
    private MoodAnalyticsDTO mood;
    private ScreenTimeAnalyticsDTO screenTime;
    private ActivityAnalyticsDTO activity;

    public HealthOverviewDTO() {}

    public HealthOverviewDTO(Long userId, LocalDate startDate, LocalDate endDate,
                             SleepAnalyticsDTO sleep, MoodAnalyticsDTO mood,
                             ScreenTimeAnalyticsDTO screenTime, ActivityAnalyticsDTO activity) {
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sleep = sleep;
        this.mood = mood;
        this.screenTime = screenTime;
        this.activity = activity;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public SleepAnalyticsDTO getSleep() {
        return sleep;
    }

    public void setSleep(SleepAnalyticsDTO sleep) {
        this.sleep = sleep;
    }

    public MoodAnalyticsDTO getMood() {
        return mood;
    }

    public void setMood(MoodAnalyticsDTO mood) {
        this.mood = mood;
    }

    public ScreenTimeAnalyticsDTO getScreenTime() {
        return screenTime;
    }

    public void setScreenTime(ScreenTimeAnalyticsDTO screenTime) {
        this.screenTime = screenTime;
    }

    public ActivityAnalyticsDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityAnalyticsDTO activity) {
        this.activity = activity;
    }
}
