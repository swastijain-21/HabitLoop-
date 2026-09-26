package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.ExperimentAnalyticsDTO;
import HabitLoop.backend.entity.Experiment;
import HabitLoop.backend.entity.HabitLog;
import HabitLoop.backend.entity.HealthData;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.repository.ExperimentRepository;
import HabitLoop.backend.repository.HabitLogRepository;
import HabitLoop.backend.repository.HealthDataRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ExperimentAnalyticsService {

    private final ExperimentRepository experimentRepository;
    private final HealthDataRepository healthDataRepository;
    private final MoodLogRepository moodLogRepository;
    private final HabitLogRepository habitLogRepository;
    private final AnalyticsCalculationHelper calcHelper;

    public ExperimentAnalyticsService(ExperimentRepository experimentRepository,
                                      HealthDataRepository healthDataRepository,
                                      MoodLogRepository moodLogRepository,
                                      HabitLogRepository habitLogRepository,
                                      AnalyticsCalculationHelper calcHelper) {
        this.experimentRepository = experimentRepository;
        this.healthDataRepository = healthDataRepository;
        this.moodLogRepository = moodLogRepository;
        this.habitLogRepository = habitLogRepository;
        this.calcHelper = calcHelper;
    }

    public Optional<ExperimentAnalyticsDTO> analyzeExperiment(Long experimentId) {
        if (experimentId == null) {
            return Optional.empty();
        }
        Optional<Experiment> optExp = experimentRepository.findById(experimentId);
        if (optExp.isEmpty()) {
            return Optional.empty();
        }
        Experiment exp = optExp.get();
        return Optional.of(calculateExperimentMetrics(exp));
    }

    public List<ExperimentAnalyticsDTO> analyzeUserExperiments(Long userId) {
        if (userId == null) {
            return List.of();
        }
        List<Experiment> experiments = experimentRepository.findByUserId(userId);
        return experiments.stream()
                .map(this::calculateExperimentMetrics)
                .toList();
    }

    public ExperimentAnalyticsDTO calculateExperimentMetrics(Experiment exp) {
        Long userId = exp.getUser().getId();
        String metric = exp.getTargetMetric() != null ? exp.getTargetMetric().toUpperCase() : "UNKNOWN";

        LocalDate bStart = exp.getBeforeStartDate();
        LocalDate bEnd = exp.getBeforeEndDate();
        LocalDate dStart = exp.getDuringStartDate();
        LocalDate dEnd = exp.getDuringEndDate();

        List<Double> beforeValues;
        List<Double> duringValues;
        String unit;

        switch (metric) {
            case "SLEEP_HOURS":
                unit = "hours";
                beforeValues = fetchSleepHours(userId, bStart, bEnd);
                duringValues = fetchSleepHours(userId, dStart, dEnd);
                break;
            case "MOOD_SCORE":
                unit = "points (1-10)";
                beforeValues = fetchMoodScores(userId, bStart, bEnd);
                duringValues = fetchMoodScores(userId, dStart, dEnd);
                break;
            case "SCREEN_TIME_MINUTES":
                unit = "minutes";
                beforeValues = fetchScreenTime(userId, bStart, bEnd);
                duringValues = fetchScreenTime(userId, dStart, dEnd);
                break;
            case "ACTIVE_MINUTES":
                unit = "minutes";
                beforeValues = fetchActiveMinutes(userId, bStart, bEnd);
                duringValues = fetchActiveMinutes(userId, dStart, dEnd);
                break;
            case "STEP_COUNT":
                unit = "steps";
                beforeValues = fetchStepCount(userId, bStart, bEnd);
                duringValues = fetchStepCount(userId, dStart, dEnd);
                break;
            case "HABIT_COMPLETION":
                unit = "%";
                Long habitId = exp.getHabit() != null ? exp.getHabit().getId() : null;
                beforeValues = fetchHabitCompletion(habitId, bStart, bEnd);
                duringValues = fetchHabitCompletion(habitId, dStart, dEnd);
                break;
            default:
                unit = "units";
                beforeValues = List.of();
                duringValues = List.of();
                break;
        }

        int beforeCount = beforeValues.size();
        int duringCount = duringValues.size();
        boolean hasSufficient = beforeCount >= 1 && duringCount >= 1;

        Double beforeAvg = calcHelper.calculateMean(beforeValues);
        Double duringAvg = calcHelper.calculateMean(duringValues);
        Double absChange = calcHelper.safeAbsoluteChange(beforeAvg, duringAvg);
        Double pctChange = calcHelper.safePercentageChange(beforeAvg, duringAvg);

        String direction = "NO_CHANGE";
        if (absChange != null) {
            if (absChange > 0.01) {
                direction = "INCREASE";
            } else if (absChange < -0.01) {
                direction = "DECREASE";
            }
        } else {
            direction = "INSUFFICIENT_DATA";
        }

        String descriptiveResult = buildDescriptiveSummary(
                exp.getTitle(), metric, unit, beforeAvg, duringAvg,
                absChange, pctChange, beforeCount, duringCount
        );

        return new ExperimentAnalyticsDTO(
                exp.getId(), userId, exp.getTitle(), exp.getHypothesis(),
                metric, unit, exp.getStatus(),
                bStart, bEnd, dStart, dEnd,
                beforeAvg, duringAvg, absChange, pctChange,
                beforeCount, duringCount, hasSufficient, direction, descriptiveResult
        );
    }

    private String buildDescriptiveSummary(String title, String metric, String unit,
                                           Double beforeAvg, Double duringAvg,
                                           Double absChange, Double pctChange,
                                           int beforeCount, int duringCount) {
        if (beforeAvg == null || duringAvg == null) {
            return String.format("Experiment '%s' currently has insufficient data for descriptive comparison " +
                            "(baseline records: %d, intervention records: %d).",
                    title, beforeCount, duringCount);
        }

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("During the baseline period, the average was %.2f %s (%d records). ",
                beforeAvg, unit, beforeCount));
        sb.append(String.format("During the intervention period, the average was %.2f %s (%d records). ",
                duringAvg, unit, duringCount));

        if (absChange != null) {
            if (absChange > 0.01) {
                sb.append(String.format("This reflects a measured increase of %.2f %s", absChange, unit));
            } else if (absChange < -0.01) {
                sb.append(String.format("This reflects a measured decrease of %.2f %s", Math.abs(absChange), unit));
            } else {
                sb.append(String.format("The average remained unchanged (change: 0.00 %s", unit));
            }

            if (pctChange != null) {
                sb.append(String.format(" (%+.2f%%).", pctChange));
            } else {
                sb.append(".");
            }
        }
        return sb.toString();
    }

    private List<Double> fetchSleepHours(Long userId, LocalDate start, LocalDate end) {
        return healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, start, end)
                .stream()
                .map(HealthData::getSleepHours)
                .filter(Objects::nonNull)
                .map(BigDecimal::doubleValue)
                .toList();
    }

    private List<Double> fetchMoodScores(Long userId, LocalDate start, LocalDate end) {
        return moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, start, end)
                .stream()
                .map(MoodLog::getScore)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
    }

    private List<Double> fetchScreenTime(Long userId, LocalDate start, LocalDate end) {
        return healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, start, end)
                .stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
    }

    private List<Double> fetchActiveMinutes(Long userId, LocalDate start, LocalDate end) {
        return healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, start, end)
                .stream()
                .map(HealthData::getActiveMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
    }

    private List<Double> fetchStepCount(Long userId, LocalDate start, LocalDate end) {
        return healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, start, end)
                .stream()
                .map(HealthData::getStepCount)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
    }

    private List<Double> fetchHabitCompletion(Long habitId, LocalDate start, LocalDate end) {
        if (habitId == null) {
            return List.of();
        }
        return habitLogRepository.findByHabitIdAndLogDateBetween(habitId, start, end)
                .stream()
                .map(hl -> hl.isCompleted() ? 100.0 : 0.0)
                .toList();
    }
}
