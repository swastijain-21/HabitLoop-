package HabitLoop.backend.dto.analytics;

import java.util.List;

public class CrossDomainAnalyticsSummaryDTO {
    private Long userId;
    private PeriodBoundaryDTO currentPeriod;
    private PeriodBoundaryDTO previousPeriod;
    private HabitDomainSummaryDTO habits;
    private SleepDomainSummaryDTO sleep;
    private MoodDomainSummaryDTO mood;
    private MetricComparisonDTO screenTime;
    private ActivityDomainSummaryDTO activity;
    private List<ExperimentAnalyticsDTO> experiments;

    public CrossDomainAnalyticsSummaryDTO() {}

    public CrossDomainAnalyticsSummaryDTO(Long userId,
                                          PeriodBoundaryDTO currentPeriod,
                                          PeriodBoundaryDTO previousPeriod,
                                          HabitDomainSummaryDTO habits,
                                          SleepDomainSummaryDTO sleep,
                                          MoodDomainSummaryDTO mood,
                                          MetricComparisonDTO screenTime,
                                          ActivityDomainSummaryDTO activity,
                                          List<ExperimentAnalyticsDTO> experiments) {
        this.userId = userId;
        this.currentPeriod = currentPeriod;
        this.previousPeriod = previousPeriod;
        this.habits = habits;
        this.sleep = sleep;
        this.mood = mood;
        this.screenTime = screenTime;
        this.activity = activity;
        this.experiments = experiments;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public PeriodBoundaryDTO getCurrentPeriod() {
        return currentPeriod;
    }

    public void setCurrentPeriod(PeriodBoundaryDTO currentPeriod) {
        this.currentPeriod = currentPeriod;
    }

    public PeriodBoundaryDTO getPreviousPeriod() {
        return previousPeriod;
    }

    public void setPreviousPeriod(PeriodBoundaryDTO previousPeriod) {
        this.previousPeriod = previousPeriod;
    }

    public HabitDomainSummaryDTO getHabits() {
        return habits;
    }

    public void setHabits(HabitDomainSummaryDTO habits) {
        this.habits = habits;
    }

    public SleepDomainSummaryDTO getSleep() {
        return sleep;
    }

    public void setSleep(SleepDomainSummaryDTO sleep) {
        this.sleep = sleep;
    }

    public MoodDomainSummaryDTO getMood() {
        return mood;
    }

    public void setMood(MoodDomainSummaryDTO mood) {
        this.mood = mood;
    }

    public MetricComparisonDTO getScreenTime() {
        return screenTime;
    }

    public void setScreenTime(MetricComparisonDTO screenTime) {
        this.screenTime = screenTime;
    }

    public ActivityDomainSummaryDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityDomainSummaryDTO activity) {
        this.activity = activity;
    }

    public List<ExperimentAnalyticsDTO> getExperiments() {
        return experiments;
    }

    public void setExperiments(List<ExperimentAnalyticsDTO> experiments) {
        this.experiments = experiments;
    }
}
