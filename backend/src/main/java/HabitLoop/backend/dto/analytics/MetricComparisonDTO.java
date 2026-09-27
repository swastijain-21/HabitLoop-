package HabitLoop.backend.dto.analytics;

public class MetricComparisonDTO {
    private Double currentAverage;
    private Double previousAverage;
    private Double change;
    private Double percentageChange;
    private String unit;
    private int currentRecords;
    private int previousRecords;

    public MetricComparisonDTO() {}

    public MetricComparisonDTO(Double currentAverage, Double previousAverage,
                               Double change, Double percentageChange,
                               String unit, int currentRecords, int previousRecords) {
        this.currentAverage = currentAverage;
        this.previousAverage = previousAverage;
        this.change = change;
        this.percentageChange = percentageChange;
        this.unit = unit;
        this.currentRecords = currentRecords;
        this.previousRecords = previousRecords;
    }

    public Double getCurrentAverage() {
        return currentAverage;
    }

    public void setCurrentAverage(Double currentAverage) {
        this.currentAverage = currentAverage;
    }

    public Double getPreviousAverage() {
        return previousAverage;
    }

    public void setPreviousAverage(Double previousAverage) {
        this.previousAverage = previousAverage;
    }

    public Double getChange() {
        return change;
    }

    public void setChange(Double change) {
        this.change = change;
    }

    public Double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(Double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getCurrentRecords() {
        return currentRecords;
    }

    public void setCurrentRecords(int currentRecords) {
        this.currentRecords = currentRecords;
    }

    public int getPreviousRecords() {
        return previousRecords;
    }

    public void setPreviousRecords(int previousRecords) {
        this.previousRecords = previousRecords;
    }
}
