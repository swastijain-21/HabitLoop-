package HabitLoop.backend.dto.analytics;

public class ActivityDomainSummaryDTO {
    private MetricComparisonDTO steps;
    private MetricComparisonDTO activeMinutes;
    private MetricComparisonDTO waterIntake;

    public ActivityDomainSummaryDTO() {}

    public ActivityDomainSummaryDTO(MetricComparisonDTO steps,
                                    MetricComparisonDTO activeMinutes,
                                    MetricComparisonDTO waterIntake) {
        this.steps = steps;
        this.activeMinutes = activeMinutes;
        this.waterIntake = waterIntake;
    }

    public MetricComparisonDTO getSteps() {
        return steps;
    }

    public void setSteps(MetricComparisonDTO steps) {
        this.steps = steps;
    }

    public MetricComparisonDTO getActiveMinutes() {
        return activeMinutes;
    }

    public void setActiveMinutes(MetricComparisonDTO activeMinutes) {
        this.activeMinutes = activeMinutes;
    }

    public MetricComparisonDTO getWaterIntake() {
        return waterIntake;
    }

    public void setWaterIntake(MetricComparisonDTO waterIntake) {
        this.waterIntake = waterIntake;
    }
}
