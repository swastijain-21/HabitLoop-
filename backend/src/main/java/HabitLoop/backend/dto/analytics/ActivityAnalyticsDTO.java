package HabitLoop.backend.dto.analytics;

public class ActivityAnalyticsDTO {
    private Double averageSteps;
    private Long totalSteps;
    private Integer minSteps;
    private Integer maxSteps;
    private Double averageActiveMinutes;
    private Integer totalActiveMinutes;
    private Double averageWaterMl;
    private int totalRecords;
    private String trend;
    private PeriodComparisonDTO periodComparison;

    public ActivityAnalyticsDTO() {}

    public ActivityAnalyticsDTO(Double averageSteps, Long totalSteps, Integer minSteps, Integer maxSteps,
                                Double averageActiveMinutes, Integer totalActiveMinutes, Double averageWaterMl,
                                int totalRecords, String trend, PeriodComparisonDTO periodComparison) {
        this.averageSteps = averageSteps;
        this.totalSteps = totalSteps;
        this.minSteps = minSteps;
        this.maxSteps = maxSteps;
        this.averageActiveMinutes = averageActiveMinutes;
        this.totalActiveMinutes = totalActiveMinutes;
        this.averageWaterMl = averageWaterMl;
        this.totalRecords = totalRecords;
        this.trend = trend;
        this.periodComparison = periodComparison;
    }

    public Double getAverageSteps() {
        return averageSteps;
    }

    public void setAverageSteps(Double averageSteps) {
        this.averageSteps = averageSteps;
    }

    public Long getTotalSteps() {
        return totalSteps;
    }

    public void setTotalSteps(Long totalSteps) {
        this.totalSteps = totalSteps;
    }

    public Integer getMinSteps() {
        return minSteps;
    }

    public void setMinSteps(Integer minSteps) {
        this.minSteps = minSteps;
    }

    public Integer getMaxSteps() {
        return maxSteps;
    }

    public void setMaxSteps(Integer maxSteps) {
        this.maxSteps = maxSteps;
    }

    public Double getAverageActiveMinutes() {
        return averageActiveMinutes;
    }

    public void setAverageActiveMinutes(Double averageActiveMinutes) {
        this.averageActiveMinutes = averageActiveMinutes;
    }

    public Integer getTotalActiveMinutes() {
        return totalActiveMinutes;
    }

    public void setTotalActiveMinutes(Integer totalActiveMinutes) {
        this.totalActiveMinutes = totalActiveMinutes;
    }

    public Double getAverageWaterMl() {
        return averageWaterMl;
    }

    public void setAverageWaterMl(Double averageWaterMl) {
        this.averageWaterMl = averageWaterMl;
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
