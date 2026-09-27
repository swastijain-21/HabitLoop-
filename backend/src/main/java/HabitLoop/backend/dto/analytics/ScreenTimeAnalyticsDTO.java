package HabitLoop.backend.dto.analytics;

public class ScreenTimeAnalyticsDTO {
    private Double averageMinutes;
    private Double totalHours;
    private Integer minMinutes;
    private Integer maxMinutes;
    private int totalRecords;
    private String trend;
    private PeriodComparisonDTO periodComparison;

    public ScreenTimeAnalyticsDTO() {}

    public ScreenTimeAnalyticsDTO(Double averageMinutes, Double totalHours, Integer minMinutes,
                                  Integer maxMinutes, int totalRecords, String trend,
                                  PeriodComparisonDTO periodComparison) {
        this.averageMinutes = averageMinutes;
        this.totalHours = totalHours;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.totalRecords = totalRecords;
        this.trend = trend;
        this.periodComparison = periodComparison;
    }

    public Double getAverageMinutes() {
        return averageMinutes;
    }

    public void setAverageMinutes(Double averageMinutes) {
        this.averageMinutes = averageMinutes;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public Integer getMinMinutes() {
        return minMinutes;
    }

    public void setMinMinutes(Integer minMinutes) {
        this.minMinutes = minMinutes;
    }

    public Integer getMaxMinutes() {
        return maxMinutes;
    }

    public void setMaxMinutes(Integer maxMinutes) {
        this.maxMinutes = maxMinutes;
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
