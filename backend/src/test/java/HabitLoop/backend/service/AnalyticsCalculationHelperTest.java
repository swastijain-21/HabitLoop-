package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AnalyticsCalculationHelperTest {

    private AnalyticsCalculationHelper helper;

    @BeforeEach
    void setUp() {
        helper = new AnalyticsCalculationHelper();
    }

    @Test
    @DisplayName("calculateMetricComparison: normal values compute mean, absChange, pctChange correctly")
    void calculateMetricComparison_NormalValues() {
        List<Double> previous = List.of(5.0, 6.0, 7.0); // mean = 6.0
        List<Double> current = List.of(7.0, 8.0, 9.0);   // mean = 8.0

        MetricComparisonDTO comp = helper.calculateMetricComparison("hours", previous, current);

        assertNotNull(comp);
        assertEquals(8.0, comp.getCurrentAverage());
        assertEquals(6.0, comp.getPreviousAverage());
        assertEquals(2.0, comp.getChange());
        assertEquals(33.33, comp.getPercentageChange());
        assertEquals("hours", comp.getUnit());
        assertEquals(3, comp.getCurrentRecords());
        assertEquals(3, comp.getPreviousRecords());
    }

    @Test
    @DisplayName("calculateMetricComparison: zero baseline returns null percentageChange")
    void calculateMetricComparison_ZeroBaseline() {
        List<Double> previous = List.of(0.0, 0.0);
        List<Double> current = List.of(5.0, 5.0);

        MetricComparisonDTO comp = helper.calculateMetricComparison("steps", previous, current);

        assertEquals(5.0, comp.getCurrentAverage());
        assertEquals(0.0, comp.getPreviousAverage());
        assertEquals(5.0, comp.getChange());
        assertNull(comp.getPercentageChange());
    }

    @Test
    @DisplayName("calculateMetricComparison: both zeros return 0.0 percentageChange")
    void calculateMetricComparison_BothZeros() {
        List<Double> previous = List.of(0.0);
        List<Double> current = List.of(0.0);

        MetricComparisonDTO comp = helper.calculateMetricComparison("units", previous, current);

        assertEquals(0.0, comp.getCurrentAverage());
        assertEquals(0.0, comp.getPreviousAverage());
        assertEquals(0.0, comp.getChange());
        assertEquals(0.0, comp.getPercentageChange());
    }

    @Test
    @DisplayName("calculateMetricComparison: empty and null lists return null averages")
    void calculateMetricComparison_EmptyLists() {
        MetricComparisonDTO comp = helper.calculateMetricComparison("hours", null, List.of());

        assertNull(comp.getCurrentAverage());
        assertNull(comp.getPreviousAverage());
        assertNull(comp.getChange());
        assertNull(comp.getPercentageChange());
        assertEquals(0, comp.getCurrentRecords());
        assertEquals(0, comp.getPreviousRecords());
    }

    @Test
    @DisplayName("calculateMean: correctly filters nulls and rounds")
    void calculateMean_WithNulls() {
        Double mean = helper.calculateMean(java.util.Arrays.asList(10.0, null, 20.0));
        assertEquals(15.0, mean);

        assertNull(helper.calculateMean(null));
        assertNull(helper.calculateMean(List.of()));
        assertNull(helper.calculateMean(java.util.Arrays.asList(null, null)));
    }

    @Test
    @DisplayName("safePercentageChange: handles nulls, zero baselines, positive and negative shifts")
    void safePercentageChange_Cases() {
        assertNull(helper.safePercentageChange(null, 5.0));
        assertNull(helper.safePercentageChange(5.0, null));
        assertEquals(0.0, helper.safePercentageChange(0.0, 0.0));
        assertNull(helper.safePercentageChange(0.0, 10.0));
        assertEquals(50.0, helper.safePercentageChange(10.0, 15.0));
        assertEquals(-25.0, helper.safePercentageChange(20.0, 15.0));
    }

    @Test
    @DisplayName("CrossDomainAnalyticsSummaryDTO correctly stores and exposes structured hierarchy")
    void crossDomainSummary_DtoContract() {
        PeriodBoundaryDTO curPeriod = new PeriodBoundaryDTO(LocalDate.of(2026, 9, 17), LocalDate.of(2026, 9, 23));
        PeriodBoundaryDTO prevPeriod = new PeriodBoundaryDTO(LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 16));

        HabitDomainSummaryDTO habits = new HabitDomainSummaryDTO(4, 4, 82.14, 11, 11, "IMPROVING");
        SleepDomainSummaryDTO sleep = new SleepDomainSummaryDTO(7.1, 5.8, 1.3, 22.41, "hours", 7, 7, null);
        MoodDomainSummaryDTO mood = new MoodDomainSummaryDTO(7.0, 6.0, 1.0, 16.67, "points (1-10)", 7, 7, "Content", null, null);
        MetricComparisonDTO screenTime = new MetricComparisonDTO(280.0, 385.71, -105.71, -27.41, "minutes", 7, 7);
        ActivityDomainSummaryDTO activity = new ActivityDomainSummaryDTO(
                new MetricComparisonDTO(10842.86, 9200.0, 1642.86, 17.86, "steps", 7, 7),
                new MetricComparisonDTO(50.71, 35.0, 15.71, 44.89, "minutes", 7, 7),
                new MetricComparisonDTO(2742.86, 2100.0, 642.86, 30.61, "ml", 7, 7)
        );

        CrossDomainAnalyticsSummaryDTO summary = new CrossDomainAnalyticsSummaryDTO(
                1L, curPeriod, prevPeriod, habits, sleep, mood, screenTime, activity, List.of()
        );

        assertEquals(1L, summary.getUserId());
        assertEquals(LocalDate.of(2026, 9, 17), summary.getCurrentPeriod().getStartDate());
        assertEquals(LocalDate.of(2026, 9, 23), summary.getCurrentPeriod().getEndDate());
        assertEquals(LocalDate.of(2026, 9, 10), summary.getPreviousPeriod().getStartDate());
        assertEquals(LocalDate.of(2026, 9, 16), summary.getPreviousPeriod().getEndDate());
        assertEquals(82.14, summary.getHabits().getCompletionPercentage());
        assertEquals(7.1, summary.getSleep().getCurrentAverage());
        assertEquals(5.8, summary.getSleep().getPreviousAverage());
        assertEquals(1.3, summary.getSleep().getChange());
        assertEquals(22.41, summary.getSleep().getPercentageChange());
        assertEquals(7.0, summary.getMood().getCurrentAverage());
        assertEquals("Content", summary.getMood().getDominantMood());
        assertEquals(280.0, summary.getScreenTime().getCurrentAverage());
        assertEquals(10842.86, summary.getActivity().getSteps().getCurrentAverage());
        assertEquals(50.71, summary.getActivity().getActiveMinutes().getCurrentAverage());
        assertEquals(2742.86, summary.getActivity().getWaterIntake().getCurrentAverage());
    }
}
