package HabitLoop.backend.dto.analytics;

public class MoodDomainSummaryDTO extends MetricComparisonDTO {
    private String dominantMood;
    private MetricComparisonDTO energyLevel;
    private MetricComparisonDTO stressLevel;

    public MoodDomainSummaryDTO() {
        super();
    }

    public MoodDomainSummaryDTO(Double currentAverage, Double previousAverage,
                                Double change, Double percentageChange,
                                String unit, int currentRecords, int previousRecords,
                                String dominantMood,
                                MetricComparisonDTO energyLevel,
                                MetricComparisonDTO stressLevel) {
        super(currentAverage, previousAverage, change, percentageChange, unit, currentRecords, previousRecords);
        this.dominantMood = dominantMood;
        this.energyLevel = energyLevel;
        this.stressLevel = stressLevel;
    }

    public String getDominantMood() {
        return dominantMood;
    }

    public void setDominantMood(String dominantMood) {
        this.dominantMood = dominantMood;
    }

    public MetricComparisonDTO getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(MetricComparisonDTO energyLevel) {
        this.energyLevel = energyLevel;
    }

    public MetricComparisonDTO getStressLevel() {
        return stressLevel;
    }

    public void setStressLevel(MetricComparisonDTO stressLevel) {
        this.stressLevel = stressLevel;
    }
}
