package HabitLoop.backend.dto.analytics;

import java.time.LocalDate;
import java.util.Map;

public class ExperimentAnalyticsDTO {
    private Long experimentId;
    private Long userId;
    private String title;
    private String hypothesis;
    private String targetMetric;
    private String unit;
    private String status;
    private LocalDate beforeStartDate;
    private LocalDate beforeEndDate;
    private LocalDate duringStartDate;
    private LocalDate duringEndDate;
    private Double beforeAverage;
    private Double duringAverage;
    private Double absoluteChange;
    private Double percentageChange;
    private int beforeCount;
    private int duringCount;
    private boolean hasSufficientData;
    private String direction;
    private String descriptiveResult;
    private Map<String, MetricComparisonDTO> metrics;

    public ExperimentAnalyticsDTO() {}

    public ExperimentAnalyticsDTO(Long experimentId, Long userId, String title, String hypothesis,
                                  String targetMetric, String unit, String status,
                                  LocalDate beforeStartDate, LocalDate beforeEndDate,
                                  LocalDate duringStartDate, LocalDate duringEndDate,
                                  Double beforeAverage, Double duringAverage,
                                  Double absoluteChange, Double percentageChange,
                                  int beforeCount, int duringCount, boolean hasSufficientData,
                                  String direction, String descriptiveResult) {
        this(experimentId, userId, title, hypothesis, targetMetric, unit, status,
                beforeStartDate, beforeEndDate, duringStartDate, duringEndDate,
                beforeAverage, duringAverage, absoluteChange, percentageChange,
                beforeCount, duringCount, hasSufficientData, direction, descriptiveResult, null);
    }

    public ExperimentAnalyticsDTO(Long experimentId, Long userId, String title, String hypothesis,
                                  String targetMetric, String unit, String status,
                                  LocalDate beforeStartDate, LocalDate beforeEndDate,
                                  LocalDate duringStartDate, LocalDate duringEndDate,
                                  Double beforeAverage, Double duringAverage,
                                  Double absoluteChange, Double percentageChange,
                                  int beforeCount, int duringCount, boolean hasSufficientData,
                                  String direction, String descriptiveResult,
                                  Map<String, MetricComparisonDTO> metrics) {
        this.experimentId = experimentId;
        this.userId = userId;
        this.title = title;
        this.hypothesis = hypothesis;
        this.targetMetric = targetMetric;
        this.unit = unit;
        this.status = status;
        this.beforeStartDate = beforeStartDate;
        this.beforeEndDate = beforeEndDate;
        this.duringStartDate = duringStartDate;
        this.duringEndDate = duringEndDate;
        this.beforeAverage = beforeAverage;
        this.duringAverage = duringAverage;
        this.absoluteChange = absoluteChange;
        this.percentageChange = percentageChange;
        this.beforeCount = beforeCount;
        this.duringCount = duringCount;
        this.hasSufficientData = hasSufficientData;
        this.direction = direction;
        this.descriptiveResult = descriptiveResult;
        this.metrics = metrics;
    }

    // Getters and Setters
    public Long getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(Long experimentId) {
        this.experimentId = experimentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHypothesis() {
        return hypothesis;
    }

    public void setHypothesis(String hypothesis) {
        this.hypothesis = hypothesis;
    }

    public String getTargetMetric() {
        return targetMetric;
    }

    public void setTargetMetric(String targetMetric) {
        this.targetMetric = targetMetric;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getBeforeStartDate() {
        return beforeStartDate;
    }

    public void setBeforeStartDate(LocalDate beforeStartDate) {
        this.beforeStartDate = beforeStartDate;
    }

    public LocalDate getBeforeEndDate() {
        return beforeEndDate;
    }

    public void setBeforeEndDate(LocalDate beforeEndDate) {
        this.beforeEndDate = beforeEndDate;
    }

    public LocalDate getDuringStartDate() {
        return duringStartDate;
    }

    public void setDuringStartDate(LocalDate duringStartDate) {
        this.duringStartDate = duringStartDate;
    }

    public LocalDate getDuringEndDate() {
        return duringEndDate;
    }

    public void setDuringEndDate(LocalDate duringEndDate) {
        this.duringEndDate = duringEndDate;
    }

    public Double getBeforeAverage() {
        return beforeAverage;
    }

    public void setBeforeAverage(Double beforeAverage) {
        this.beforeAverage = beforeAverage;
    }

    public Double getDuringAverage() {
        return duringAverage;
    }

    public void setDuringAverage(Double duringAverage) {
        this.duringAverage = duringAverage;
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

    public int getBeforeCount() {
        return beforeCount;
    }

    public void setBeforeCount(int beforeCount) {
        this.beforeCount = beforeCount;
    }

    public int getDuringCount() {
        return duringCount;
    }

    public void setDuringCount(int duringCount) {
        this.duringCount = duringCount;
    }

    public boolean isHasSufficientData() {
        return hasSufficientData;
    }

    public void setHasSufficientData(boolean hasSufficientData) {
        this.hasSufficientData = hasSufficientData;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getDescriptiveResult() {
        return descriptiveResult;
    }

    public void setDescriptiveResult(String descriptiveResult) {
        this.descriptiveResult = descriptiveResult;
    }

    public Map<String, MetricComparisonDTO> getMetrics() {
        return metrics;
    }

    public void setMetrics(Map<String, MetricComparisonDTO> metrics) {
        this.metrics = metrics;
    }
}
