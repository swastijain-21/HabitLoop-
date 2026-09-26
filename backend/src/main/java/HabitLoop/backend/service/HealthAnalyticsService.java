package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.*;
import HabitLoop.backend.entity.HealthData;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.repository.HealthDataRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HealthAnalyticsService {

    private final HealthDataRepository healthDataRepository;
    private final MoodLogRepository moodLogRepository;
    private final AnalyticsCalculationHelper calcHelper;

    public HealthAnalyticsService(HealthDataRepository healthDataRepository,
                                  MoodLogRepository moodLogRepository,
                                  AnalyticsCalculationHelper calcHelper) {
        this.healthDataRepository = healthDataRepository;
        this.moodLogRepository = moodLogRepository;
        this.calcHelper = calcHelper;
    }

    // =========================================================================
    // 1. SLEEP ANALYTICS
    // =========================================================================
    public SleepAnalyticsDTO getSleepAnalytics(Long userId, LocalDate startDate, LocalDate endDate) {
        if (userId == null || startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return new SleepAnalyticsDTO(null, null, null, null, 0, "INSUFFICIENT_DATA", null);
        }

        List<HealthData> records = healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
                userId, startDate, endDate
        );

        List<Double> sleepHoursList = records.stream()
                .map(HealthData::getSleepHours)
                .filter(Objects::nonNull)
                .map(BigDecimal::doubleValue)
                .toList();

        List<Double> qualityList = records.stream()
                .map(HealthData::getSleepQuality)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        Double avgSleep = calcHelper.calculateMean(sleepHoursList);
        Double minSleep = calcHelper.calculateMin(sleepHoursList);
        Double maxSleep = calcHelper.calculateMax(sleepHoursList);
        Double avgQuality = calcHelper.calculateMean(qualityList);
        String trend = calcHelper.determineTrend(sleepHoursList);

        // Period comparison: first half vs second half
        PeriodComparisonDTO comparison = null;
        if (sleepHoursList.size() >= 2) {
            int mid = sleepHoursList.size() / 2;
            List<Double> firstHalf = sleepHoursList.subList(0, mid);
            List<Double> secondHalf = sleepHoursList.subList(mid, sleepHoursList.size());
            comparison = calcHelper.comparePeriods("Sleep Duration", "hours", firstHalf, secondHalf);
        }

        return new SleepAnalyticsDTO(avgSleep, minSleep, maxSleep, avgQuality, sleepHoursList.size(), trend, comparison);
    }

    // =========================================================================
    // 2. MOOD ANALYTICS
    // =========================================================================
    public MoodAnalyticsDTO getMoodAnalytics(Long userId, LocalDate startDate, LocalDate endDate) {
        if (userId == null || startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return new MoodAnalyticsDTO(null, null, null, null, null, null, 0, "INSUFFICIENT_DATA", null);
        }

        List<MoodLog> records = moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(
                userId, startDate, endDate
        );

        List<Double> scores = records.stream()
                .map(m -> Double.valueOf(m.getScore()))
                .toList();

        List<Double> energy = records.stream()
                .map(MoodLog::getEnergyLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        List<Double> stress = records.stream()
                .map(MoodLog::getStressLevel)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        Double avgScore = calcHelper.calculateMean(scores);
        Integer minScore = records.stream().map(MoodLog::getScore).min(Integer::compareTo).orElse(null);
        Integer maxScore = records.stream().map(MoodLog::getScore).max(Integer::compareTo).orElse(null);
        Double avgEnergy = calcHelper.calculateMean(energy);
        Double avgStress = calcHelper.calculateMean(stress);
        String trend = calcHelper.determineTrend(scores);

        // Dominant Mood Label
        String dominantMood = records.stream()
                .map(MoodLog::getMoodLabel)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // Period comparison: first half vs second half
        PeriodComparisonDTO comparison = null;
        if (scores.size() >= 2) {
            int mid = scores.size() / 2;
            List<Double> firstHalf = scores.subList(0, mid);
            List<Double> secondHalf = scores.subList(mid, scores.size());
            comparison = calcHelper.comparePeriods("Mood Rating", "points", firstHalf, secondHalf);
        }

        return new MoodAnalyticsDTO(
                avgScore, minScore, maxScore, avgEnergy, avgStress, dominantMood,
                records.size(), trend, comparison
        );
    }

    // =========================================================================
    // 3. SCREEN-TIME ANALYTICS
    // =========================================================================
    public ScreenTimeAnalyticsDTO getScreenTimeAnalytics(Long userId, LocalDate startDate, LocalDate endDate) {
        if (userId == null || startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return new ScreenTimeAnalyticsDTO(null, null, null, null, 0, "INSUFFICIENT_DATA", null);
        }

        List<HealthData> records = healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
                userId, startDate, endDate
        );

        List<Double> minutesList = records.stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        Double avgMinutes = calcHelper.calculateMean(minutesList);
        Double totalHours = null;
        if (!minutesList.isEmpty()) {
            double totalMins = minutesList.stream().mapToDouble(Double::doubleValue).sum();
            totalHours = calcHelper.round(totalMins / 60.0, 2);
        }

        Integer minMinutes = records.stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .min(Integer::compareTo)
                .orElse(null);

        Integer maxMinutes = records.stream()
                .map(HealthData::getScreenTimeMinutes)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(null);

        String trend = calcHelper.determineTrend(minutesList);

        PeriodComparisonDTO comparison = null;
        if (minutesList.size() >= 2) {
            int mid = minutesList.size() / 2;
            List<Double> firstHalf = minutesList.subList(0, mid);
            List<Double> secondHalf = minutesList.subList(mid, minutesList.size());
            comparison = calcHelper.comparePeriods("Screen Time", "minutes", firstHalf, secondHalf);
        }

        return new ScreenTimeAnalyticsDTO(
                avgMinutes, totalHours, minMinutes, maxMinutes,
                minutesList.size(), trend, comparison
        );
    }

    // =========================================================================
    // 4. ACTIVITY ANALYTICS
    // =========================================================================
    public ActivityAnalyticsDTO getActivityAnalytics(Long userId, LocalDate startDate, LocalDate endDate) {
        if (userId == null || startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return new ActivityAnalyticsDTO(null, null, null, null, null, null, null, 0, "INSUFFICIENT_DATA", null);
        }

        List<HealthData> records = healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
                userId, startDate, endDate
        );

        List<Double> stepsList = records.stream()
                .map(HealthData::getStepCount)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        List<Double> activeMinsList = records.stream()
                .map(HealthData::getActiveMinutes)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        List<Double> waterList = records.stream()
                .map(HealthData::getWaterIntakeMl)
                .filter(Objects::nonNull)
                .map(Integer::doubleValue)
                .toList();

        Double avgSteps = calcHelper.calculateMean(stepsList);
        Long totalSteps = !stepsList.isEmpty() ? (long) stepsList.stream().mapToDouble(Double::doubleValue).sum() : null;

        Integer minSteps = records.stream().map(HealthData::getStepCount).filter(Objects::nonNull).min(Integer::compareTo).orElse(null);
        Integer maxSteps = records.stream().map(HealthData::getStepCount).filter(Objects::nonNull).max(Integer::compareTo).orElse(null);

        Double avgActiveMins = calcHelper.calculateMean(activeMinsList);
        Integer totalActiveMins = !activeMinsList.isEmpty() ? (int) activeMinsList.stream().mapToDouble(Double::doubleValue).sum() : null;

        Double avgWater = calcHelper.calculateMean(waterList);
        String trend = calcHelper.determineTrend(stepsList);

        PeriodComparisonDTO comparison = null;
        if (stepsList.size() >= 2) {
            int mid = stepsList.size() / 2;
            List<Double> firstHalf = stepsList.subList(0, mid);
            List<Double> secondHalf = stepsList.subList(mid, stepsList.size());
            comparison = calcHelper.comparePeriods("Daily Steps", "steps", firstHalf, secondHalf);
        }

        return new ActivityAnalyticsDTO(
                avgSteps, totalSteps, minSteps, maxSteps, avgActiveMins, totalActiveMins,
                avgWater, records.size(), trend, comparison
        );
    }

    // =========================================================================
    // 5. COMBINED HEALTH OVERVIEW
    // =========================================================================
    public HealthOverviewDTO getHealthOverview(Long userId, LocalDate startDate, LocalDate endDate) {
        SleepAnalyticsDTO sleep = getSleepAnalytics(userId, startDate, endDate);
        MoodAnalyticsDTO mood = getMoodAnalytics(userId, startDate, endDate);
        ScreenTimeAnalyticsDTO screenTime = getScreenTimeAnalytics(userId, startDate, endDate);
        ActivityAnalyticsDTO activity = getActivityAnalytics(userId, startDate, endDate);

        return new HealthOverviewDTO(userId, startDate, endDate, sleep, mood, screenTime, activity);
    }
}
