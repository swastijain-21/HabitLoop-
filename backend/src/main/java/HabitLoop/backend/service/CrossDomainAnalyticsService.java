package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.*;
import HabitLoop.backend.entity.HealthData;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.repository.HealthDataRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CrossDomainAnalyticsService {

    private final HabitAnalyticsService habitAnalyticsService;
    private final HealthDataRepository healthDataRepository;
    private final MoodLogRepository moodLogRepository;
    private final ExperimentAnalyticsService experimentAnalyticsService;
    private final AnalyticsCalculationHelper calcHelper;

    public CrossDomainAnalyticsService(HabitAnalyticsService habitAnalyticsService,
                                       HealthDataRepository healthDataRepository,
                                       MoodLogRepository moodLogRepository,
                                       ExperimentAnalyticsService experimentAnalyticsService,
                                       AnalyticsCalculationHelper calcHelper) {
        this.habitAnalyticsService = habitAnalyticsService;
        this.healthDataRepository = healthDataRepository;
        this.moodLogRepository = moodLogRepository;
        this.experimentAnalyticsService = experimentAnalyticsService;
        this.calcHelper = calcHelper;
    }

    public CrossDomainAnalyticsSummaryDTO getCrossDomainSummary(Long userId,
                                                               LocalDate startDate,
                                                               LocalDate endDate,
                                                               LocalDate previousStartDate,
                                                               LocalDate previousEndDate) {
        // 1. Current period resolution
        LocalDate curEnd = endDate != null ? endDate : LocalDate.now();
        LocalDate curStart = startDate != null ? startDate : curEnd.minusDays(6);

        if (curStart.isAfter(curEnd)) {
            throw new IllegalArgumentException("startDate (" + curStart + ") cannot be after endDate (" + curEnd + ").");
        }

        // 2. Previous period resolution
        long durationDays = ChronoUnit.DAYS.between(curStart, curEnd) + 1;
        LocalDate prevStart;
        LocalDate prevEnd;

        if (previousStartDate != null && previousEndDate != null) {
            if (previousStartDate.isAfter(previousEndDate)) {
                throw new IllegalArgumentException("previousStartDate (" + previousStartDate + ") cannot be after previousEndDate (" + previousEndDate + ").");
            }
            prevStart = previousStartDate;
            prevEnd = previousEndDate;
        } else if (previousStartDate == null && previousEndDate == null) {
            prevEnd = curStart.minusDays(1);
            prevStart = prevEnd.minusDays(durationDays - 1);
        } else if (previousStartDate != null) {
            prevStart = previousStartDate;
            prevEnd = prevStart.plusDays(durationDays - 1);
        } else {
            prevEnd = previousEndDate;
            prevStart = prevEnd.minusDays(durationDays - 1);
        }

        // 3. Habits domain summary
        HabitSummaryDTO habitSummary = habitAnalyticsService.getUserHabitSummary(userId, curEnd);
        int totalHabits = habitSummary.getTotalHabits();
        int activeHabits = habitSummary.getActiveHabits();
        Double completionPct = habitSummary.getWeeklyCompletionPercentage();
        String trend = habitSummary.getOverallTrend();

        Integer currentStreak = 0;
        Integer longestStreak = 0;
        if (habitSummary.getHabits() != null && !habitSummary.getHabits().isEmpty()) {
            currentStreak = habitSummary.getHabits().stream()
                    .mapToInt(HabitAnalyticsDTO::getCurrentStreak)
                    .max()
                    .orElse(0);
            longestStreak = habitSummary.getHabits().stream()
                    .mapToInt(HabitAnalyticsDTO::getLongestStreak)
                    .max()
                    .orElse(0);
        }
        HabitDomainSummaryDTO habitsDTO = new HabitDomainSummaryDTO(
                totalHabits, activeHabits, completionPct, currentStreak, longestStreak, trend
        );

        // 4. Health Data records
        List<HealthData> curHealth = healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, curStart, curEnd);
        List<HealthData> prevHealth = healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, prevStart, prevEnd);

        // Sleep
        List<Double> curSleep = curHealth.stream()
                .map(HealthData::getSleepHours)
                .filter(Objects::nonNull)
                .map(BigDecimal::doubleValue)
                .toList();
        List<Double> prevSleep = prevHealth.stream()
                .map(HealthData::getSleepHours)
                .filter(Objects::nonNull)
                .map(BigDecimal::doubleValue)
                .toList();
        MetricComparisonDTO sleepHours = calcHelper.calculateMetricComparison("hours", prevSleep, curSleep);

        List<Double> curQuality = curHealth.stream()
                .map(HealthData::getSleepQuality)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevQuality = prevHealth.stream()
                .map(HealthData::getSleepQuality)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO sleepQuality = calcHelper.calculateMetricComparison("points (1-10)", prevQuality, curQuality);

        SleepDomainSummaryDTO sleepDTO = new SleepDomainSummaryDTO(
                sleepHours.getCurrentAverage(), sleepHours.getPreviousAverage(),
                sleepHours.getChange(), sleepHours.getPercentageChange(),
                "hours", sleepHours.getCurrentRecords(), sleepHours.getPreviousRecords(),
                sleepQuality
        );

        // Screen Time
        List<Double> curScreen = curHealth.stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevScreen = prevHealth.stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO screenTimeDTO = calcHelper.calculateMetricComparison("minutes", prevScreen, curScreen);

        // Activity (Steps, Active Minutes, Water Intake)
        List<Double> curSteps = curHealth.stream()
                .map(HealthData::getStepCount)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevSteps = prevHealth.stream()
                .map(HealthData::getStepCount)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO steps = calcHelper.calculateMetricComparison("steps", prevSteps, curSteps);

        List<Double> curActive = curHealth.stream()
                .map(HealthData::getActiveMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevActive = prevHealth.stream()
                .map(HealthData::getActiveMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO activeMins = calcHelper.calculateMetricComparison("minutes", prevActive, curActive);

        List<Double> curWater = curHealth.stream()
                .map(HealthData::getWaterIntakeMl)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevWater = prevHealth.stream()
                .map(HealthData::getWaterIntakeMl)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO water = calcHelper.calculateMetricComparison("ml", prevWater, curWater);

        ActivityDomainSummaryDTO activityDTO = new ActivityDomainSummaryDTO(steps, activeMins, water);

        // 5. Mood Data records
        List<MoodLog> curMood = moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, curStart, curEnd);
        List<MoodLog> prevMood = moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, prevStart, prevEnd);

        List<Double> curScores = curMood.stream().map(m -> Double.valueOf(m.getScore())).toList();
        List<Double> prevScores = prevMood.stream().map(m -> Double.valueOf(m.getScore())).toList();
        MetricComparisonDTO moodComp = calcHelper.calculateMetricComparison("points (1-10)", prevScores, curScores);

        String dominantMood = curMood.stream()
                .map(MoodLog::getMoodLabel)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        List<Double> curEnergy = curMood.stream()
                .map(MoodLog::getEnergyLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevEnergy = prevMood.stream()
                .map(MoodLog::getEnergyLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO energyComp = calcHelper.calculateMetricComparison("points (1-10)", prevEnergy, curEnergy);

        List<Double> curStress = curMood.stream()
                .map(MoodLog::getStressLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        List<Double> prevStress = prevMood.stream()
                .map(MoodLog::getStressLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();
        MetricComparisonDTO stressComp = calcHelper.calculateMetricComparison("points (1-10)", prevStress, curStress);

        MoodDomainSummaryDTO moodDTO = new MoodDomainSummaryDTO(
                moodComp.getCurrentAverage(), moodComp.getPreviousAverage(),
                moodComp.getChange(), moodComp.getPercentageChange(),
                "points (1-10)", moodComp.getCurrentRecords(), moodComp.getPreviousRecords(),
                dominantMood, energyComp, stressComp
        );

        // 6. Experiments
        List<ExperimentAnalyticsDTO> experiments = experimentAnalyticsService.analyzeUserExperiments(userId);

        // 7. Assemble cross-domain summary
        PeriodBoundaryDTO currentPeriod = new PeriodBoundaryDTO(curStart, curEnd);
        PeriodBoundaryDTO previousPeriod = new PeriodBoundaryDTO(prevStart, prevEnd);

        return new CrossDomainAnalyticsSummaryDTO(
                userId, currentPeriod, previousPeriod,
                habitsDTO, sleepDTO, moodDTO, screenTimeDTO, activityDTO, experiments
        );
    }
}
