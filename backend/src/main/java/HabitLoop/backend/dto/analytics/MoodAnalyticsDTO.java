package HabitLoop.backend.dto.analytics;

public class MoodAnalyticsDTO {
    private Double averageScore;
    private Integer minScore;
    private Integer maxScore;
    private Double averageEnergyLevel;
    private Double averageStressLevel;
    private String dominantMoodLabel;
    private int totalRecords;
    private String trend;
    private PeriodComparisonDTO periodComparison;

    public MoodAnalyticsDTO() {}

    public MoodAnalyticsDTO(Double averageScore, Integer minScore, Integer maxScore, Double averageEnergyLevel,
                            Double averageStressLevel, String dominantMoodLabel, int totalRecords,
                            String trend, PeriodComparisonDTO periodComparison) {
        this.averageScore = averageScore;
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.averageEnergyLevel = averageEnergyLevel;
        this.averageStressLevel = averageStressLevel;
        this.dominantMoodLabel = dominantMoodLabel;
        this.totalRecords = totalRecords;
        this.trend = trend;
        this.periodComparison = periodComparison;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Integer getMinScore() {
        return minScore;
    }

    public void setMinScore(Integer minScore) {
        this.minScore = minScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Double getAverageEnergyLevel() {
        return averageEnergyLevel;
    }

    public void setAverageEnergyLevel(Double averageEnergyLevel) {
        this.averageEnergyLevel = averageEnergyLevel;
    }

    public Double getAverageStressLevel() {
        return averageStressLevel;
    }

    public void setAverageStressLevel(Double averageStressLevel) {
        this.averageStressLevel = averageStressLevel;
    }

    public String getDominantMoodLabel() {
        return dominantMoodLabel;
    }

    public void setDominantMoodLabel(String dominantMoodLabel) {
        this.dominantMoodLabel = dominantMoodLabel;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public PeriodComparisonDTO getPeriodComparison() {
        return periodComparison;
    }

    public void setPeriodComparison(PeriodComparisonDTO periodComparison) {
        this.periodComparison = periodComparison;
    }
}
