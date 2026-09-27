package HabitLoop.backend.dto.analytics;

public class SleepDomainSummaryDTO extends MetricComparisonDTO {
    private MetricComparisonDTO quality;

    public SleepDomainSummaryDTO() {
        super();
    }

    public SleepDomainSummaryDTO(Double currentAverage, Double previousAverage,
                                 Double change, Double percentageChange,
                                 String unit, int currentRecords, int previousRecords,
                                 MetricComparisonDTO quality) {
        super(currentAverage, previousAverage, change, percentageChange, unit, currentRecords, previousRecords);
        this.quality = quality;
    }

    public MetricComparisonDTO getQuality() {
        return quality;
    }

    public void setQuality(MetricComparisonDTO quality) {
        this.quality = quality;
    }
}
