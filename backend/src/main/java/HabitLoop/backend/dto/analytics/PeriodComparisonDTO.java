package HabitLoop.backend.dto.analytics;

public class PeriodComparisonDTO {
    private String metricName;
    private String unit;
    private Double beforeAverage;
    private Double afterAverage;
    private Double absoluteChange;
    private Double percentageChange;
    private int beforeSampleSize;
    private int afterSampleSize;
    private String direction;
    private String descriptiveSummary;

    public PeriodComparisonDTO() {}

    public PeriodComparisonDTO(String metricName, String unit, Double beforeAverage, Double afterAverage,
                               Double absoluteChange, Double percentageChange, int beforeSampleSize,
                               int afterSampleSize, String direction, String descriptiveSummary) {
        this.metricName = metricName;
        this.unit = unit;
        this.beforeAverage = beforeAverage;
        this.afterAverage = afterAverage;
        this.absoluteChange = absoluteChange;
        this.percentageChange = percentageChange;
        this.beforeSampleSize = beforeSampleSize;
        this.afterSampleSize = afterSampleSize;
        this.direction = direction;
        this.descriptiveSummary = descriptiveSummary;
    }

    // Getters and Setters
    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getBeforeAverage() {
        return beforeAverage;
    }

    public void setBeforeAverage(Double beforeAverage) {
        this.beforeAverage = beforeAverage;
    }

    public Double getAfterAverage() {
        return afterAverage;
    }

    public void setAfterAverage(Double afterAverage) {
        this.afterAverage = afterAverage;
    }

    public Double getAbsoluteChange() {
        return absoluteChange;
    }

    public void setAbsoluteChange(Double absoluteChange) {
        this.absoluteChange = absoluteChange;
    }

    public Double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(Double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public int getBeforeSampleSize() {
        return beforeSampleSize;
    }

    public void setBeforeSampleSize(int beforeSampleSize) {
        this.beforeSampleSize = beforeSampleSize;
    }

    public int getAfterSampleSize() {
        return afterSampleSize;
    }

    public void setAfterSampleSize(int afterSampleSize) {
        this.afterSampleSize = afterSampleSize;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getDescriptiveSummary() {
        return descriptiveSummary;
    }

    public void setDescriptiveSummary(String descriptiveSummary) {
        this.descriptiveSummary = descriptiveSummary;
    }
}
