package HabitLoop.backend.dto.analytics;

public class SleepAnalyticsDTO {
    private Double averageSleepHours;
    private Double minSleepHours;
    private Double maxSleepHours;
    private Double averageSleepQuality;
    private int totalRecords;
    private String trend;
    private PeriodComparisonDTO periodComparison;

    public SleepAnalyticsDTO() {}

    public SleepAnalyticsDTO(Double averageSleepHours, Double minSleepHours, Double maxSleepHours,
                             Double averageSleepQuality, int totalRecords, String trend,
                             PeriodComparisonDTO periodComparison) {
        this.averageSleepHours = averageSleepHours;
        this.minSleepHours = minSleepHours;
        this.maxSleepHours = maxSleepHours;
        this.averageSleepQuality = averageSleepQuality;
        this.totalRecords = totalRecords;
        this.trend = trend;
        this.periodComparison = periodComparison;
    }

    public Double getAverageSleepHours() {
        return averageSleepHours;
    }

    public void setAverageSleepHours(Double averageSleepHours) {
        this.averageSleepHours = averageSleepHours;
    }

    public Double getMinSleepHours() {
        return minSleepHours;
    }

    public void setMinSleepHours(Double minSleepHours) {
        this.minSleepHours = minSleepHours;
    }

    public Double getMaxSleepHours() {
        return maxSleepHours;
    }

    public void setMaxSleepHours(Double maxSleepHours) {
        this.maxSleepHours = maxSleepHours;
    }

    public Double getAverageSleepQuality() {
        return averageSleepQuality;
    }

    public void setAverageSleepQuality(Double averageSleepQuality) {
        this.averageSleepQuality = averageSleepQuality;
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
