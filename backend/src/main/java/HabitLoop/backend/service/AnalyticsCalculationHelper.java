package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.MetricComparisonDTO;
import HabitLoop.backend.dto.analytics.PeriodComparisonDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;

@Component
public class AnalyticsCalculationHelper {

    public Double round(Double value, int decimalPlaces) {
        if (value == null || value.isNaN() || value.isInfinite()) {
            return null;
        }
        return BigDecimal.valueOf(value)
                .setScale(decimalPlaces, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public Double calculateMean(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        List<Double> nonNull = values.stream().filter(Objects::nonNull).toList();
        if (nonNull.isEmpty()) {
            return null;
        }
        double sum = nonNull.stream().mapToDouble(Double::doubleValue).sum();
        return round(sum / nonNull.size(), 2);
    }

    public Double calculateMin(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.stream()
                .filter(Objects::nonNull)
                .min(Double::compareTo)
                .map(v -> round(v, 2))
                .orElse(null);
    }

    public Double calculateMax(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.stream()
                .filter(Objects::nonNull)
                .max(Double::compareTo)
                .map(v -> round(v, 2))
                .orElse(null);
    }

    public Double safeAbsoluteChange(Double before, Double after) {
        if (before == null || after == null) {
            return null;
        }
        return round(after - before, 2);
    }

    public Double safePercentageChange(Double before, Double after) {
        if (before == null || after == null) {
            return null;
        }
        if (before == 0.0) {
            if (after == 0.0) {
                return 0.0;
            }
            // Cannot divide by zero baseline
            return null;
        }
        double change = ((after - before) / Math.abs(before)) * 100.0;
        return round(change, 2);
    }

    public String determineTrend(List<Double> chronologicalValues) {
        if (chronologicalValues == null) {
            return "INSUFFICIENT_DATA";
        }
        List<Double> nonNull = chronologicalValues.stream().filter(Objects::nonNull).toList();
        if (nonNull.size() < 2) {
            return "INSUFFICIENT_DATA";
        }
        int mid = nonNull.size() / 2;
        List<Double> firstHalf = nonNull.subList(0, mid);
        List<Double> secondHalf = nonNull.subList(mid, nonNull.size());

        Double firstAvg = calculateMean(firstHalf);
        Double secondAvg = calculateMean(secondHalf);

        if (firstAvg == null || secondAvg == null) {
            return "INSUFFICIENT_DATA";
        }

        Double pctChange = safePercentageChange(firstAvg, secondAvg);
        if (pctChange == null) {
            double diff = secondAvg - firstAvg;
            if (diff > 0.05) return "INCREASING";
            if (diff < -0.05) return "DECLINING";
            return "STABLE";
        }

        if (pctChange > 3.0) {
            return "IMPROVING";
        } else if (pctChange < -3.0) {
            return "DECLINING";
        } else {
            return "STABLE";
        }
    }

    public PeriodComparisonDTO comparePeriods(String metricName, String unit,
                                              List<Double> beforeValues,
                                              List<Double> afterValues) {
        int beforeSize = beforeValues != null ? (int) beforeValues.stream().filter(Objects::nonNull).count() : 0;
        int afterSize = afterValues != null ? (int) afterValues.stream().filter(Objects::nonNull).count() : 0;

        Double beforeAvg = calculateMean(beforeValues);
        Double afterAvg = calculateMean(afterValues);

        if (beforeSize == 0 || afterSize == 0 || beforeAvg == null || afterAvg == null) {
            return new PeriodComparisonDTO(
                    metricName, unit, beforeAvg, afterAvg, null, null,
                    beforeSize, afterSize, "INSUFFICIENT_DATA",
                    "Insufficient data to compare " + metricName + " periods."
            );
        }

        Double absChange = safeAbsoluteChange(beforeAvg, afterAvg);
        Double pctChange = safePercentageChange(beforeAvg, afterAvg);

        String direction = "NO_CHANGE";
        if (absChange != null) {
            if (absChange > 0.01) direction = "INCREASE";
            else if (absChange < -0.01) direction = "DECREASE";
        }

        StringBuilder summary = new StringBuilder();
        summary.append(String.format("Average %s changed from %.2f to %.2f %s",
                metricName, beforeAvg, afterAvg, unit));
        if (absChange != null) {
            summary.append(String.format(" (change: %+.2f %s", absChange, unit));
            if (pctChange != null) {
                summary.append(String.format(", %+.2f%%", pctChange));
            }
            summary.append(")");
        }
        summary.append(".");

        return new PeriodComparisonDTO(
                metricName, unit, beforeAvg, afterAvg, absChange, pctChange,
                beforeSize, afterSize, direction, summary.toString()
        );
    }

    public MetricComparisonDTO calculateMetricComparison(String unit,
                                                         List<Double> previousValues,
                                                         List<Double> currentValues) {
        int prevCount = previousValues != null ? (int) previousValues.stream().filter(Objects::nonNull).count() : 0;
        int currCount = currentValues != null ? (int) currentValues.stream().filter(Objects::nonNull).count() : 0;

        Double prevAvg = calculateMean(previousValues);
        Double currAvg = calculateMean(currentValues);

        Double absChange = safeAbsoluteChange(prevAvg, currAvg);
        Double pctChange = safePercentageChange(prevAvg, currAvg);

        return new MetricComparisonDTO(currAvg, prevAvg, absChange, pctChange, unit, currCount, prevCount);
    }
}
