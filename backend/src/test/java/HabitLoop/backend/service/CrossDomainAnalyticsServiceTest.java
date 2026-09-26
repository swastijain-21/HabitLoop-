package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.*;
import HabitLoop.backend.entity.HealthData;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.HealthDataRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrossDomainAnalyticsServiceTest {

    @Mock
    private HabitAnalyticsService habitAnalyticsService;

    @Mock
    private HealthDataRepository healthDataRepository;

    @Mock
    private MoodLogRepository moodLogRepository;

    @Mock
    private ExperimentAnalyticsService experimentAnalyticsService;

    private AnalyticsCalculationHelper calcHelper;
    private CrossDomainAnalyticsService service;

    @BeforeEach
    void setUp() {
        calcHelper = new AnalyticsCalculationHelper();
        service = new CrossDomainAnalyticsService(
                habitAnalyticsService,
                healthDataRepository,
                moodLogRepository,
                experimentAnalyticsService,
                calcHelper
        );
    }

    @Test
    @DisplayName("Normal cross-domain analytics calculates all domains with period comparisons")
    void getCrossDomainSummary_NormalData() {
        Long userId = 1L;
        LocalDate curStart = LocalDate.of(2026, 9, 17);
        LocalDate curEnd = LocalDate.of(2026, 9, 23);
        LocalDate prevStart = LocalDate.of(2026, 9, 10);
        LocalDate prevEnd = LocalDate.of(2026, 9, 16);

        User user = new User("alice", "alice@example.com", "password", "Alice", "Smith");

        // Mock habits
        HabitAnalyticsDTO h1 = new HabitAnalyticsDTO();
        h1.setCurrentStreak(5);
        h1.setLongestStreak(12);

        HabitAnalyticsDTO h2 = new HabitAnalyticsDTO();
        h2.setCurrentStreak(8);
        h2.setLongestStreak(15);

        HabitSummaryDTO habitSummary = new HabitSummaryDTO();
        habitSummary.setTotalHabits(2);
        habitSummary.setActiveHabits(2);
        habitSummary.setWeeklyCompletionPercentage(85.0);
        habitSummary.setOverallTrend("IMPROVING");
        habitSummary.setHabits(List.of(h1, h2));

        when(habitAnalyticsService.getUserHabitSummary(eq(userId), eq(curEnd))).thenReturn(habitSummary);

        // Mock current health data (7.0 hrs sleep, 200 mins screen, 10000 steps, 45 active, 2500 ml water)
        HealthData hdCur = new HealthData(user, curStart, new BigDecimal("7.0"), 7, 200, 10000, 45, 2500, null);
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, curStart, curEnd))
                .thenReturn(List.of(hdCur));

        // Mock previous health data (5.0 hrs sleep, 300 mins screen, 8000 steps, 30 active, 2000 ml water)
        HealthData hdPrev = new HealthData(user, prevStart, new BigDecimal("5.0"), 5, 300, 8000, 30, 2000, null);
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, prevStart, prevEnd))
                .thenReturn(List.of(hdPrev));

        // Mock current mood
        MoodLog mlCur = new MoodLog(user, curStart, 8, "Energized", 7, 3, null);
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, curStart, curEnd))
                .thenReturn(List.of(mlCur));

        // Mock previous mood
        MoodLog mlPrev = new MoodLog(user, prevStart, 6, "Tired", 4, 7, null);
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, prevStart, prevEnd))
                .thenReturn(List.of(mlPrev));

        when(experimentAnalyticsService.analyzeUserExperiments(userId)).thenReturn(List.of());

        CrossDomainAnalyticsSummaryDTO summary = service.getCrossDomainSummary(
                userId, curStart, curEnd, prevStart, prevEnd
        );

        assertNotNull(summary);
        assertEquals(userId, summary.getUserId());
        assertEquals(curStart, summary.getCurrentPeriod().getStartDate());
        assertEquals(curEnd, summary.getCurrentPeriod().getEndDate());
        assertEquals(prevStart, summary.getPreviousPeriod().getStartDate());
        assertEquals(prevEnd, summary.getPreviousPeriod().getEndDate());

        // Habits assertion
        assertEquals(2, summary.getHabits().getTotalHabits());
        assertEquals(2, summary.getHabits().getActiveHabits());
        assertEquals(85.0, summary.getHabits().getCompletionPercentage());
        assertEquals(8, summary.getHabits().getCurrentStreak());
        assertEquals(15, summary.getHabits().getLongestStreak());
        assertEquals("IMPROVING", summary.getHabits().getRecentCompletionTrend());

        // Sleep assertion (5.0 -> 7.0: change = +2.0, pct = +40.0%)
        assertEquals(7.0, summary.getSleep().getCurrentAverage());
        assertEquals(5.0, summary.getSleep().getPreviousAverage());
        assertEquals(2.0, summary.getSleep().getChange());
        assertEquals(40.0, summary.getSleep().getPercentageChange());

        // Screen time assertion (300 -> 200: change = -100.0, pct = -33.33%)
        assertEquals(200.0, summary.getScreenTime().getCurrentAverage());
        assertEquals(300.0, summary.getScreenTime().getPreviousAverage());
        assertEquals(-100.0, summary.getScreenTime().getChange());
        assertEquals(-33.33, summary.getScreenTime().getPercentageChange());

        // Activity assertion
        assertEquals(10000.0, summary.getActivity().getSteps().getCurrentAverage());
        assertEquals(8000.0, summary.getActivity().getSteps().getPreviousAverage());
        assertEquals(2000.0, summary.getActivity().getSteps().getChange());
        assertEquals(25.0, summary.getActivity().getSteps().getPercentageChange());

        assertEquals(45.0, summary.getActivity().getActiveMinutes().getCurrentAverage());
        assertEquals(30.0, summary.getActivity().getActiveMinutes().getPreviousAverage());
        assertEquals(15.0, summary.getActivity().getActiveMinutes().getChange());
        assertEquals(50.0, summary.getActivity().getActiveMinutes().getPercentageChange());

        assertEquals(2500.0, summary.getActivity().getWaterIntake().getCurrentAverage());
        assertEquals(2000.0, summary.getActivity().getWaterIntake().getPreviousAverage());
        assertEquals(500.0, summary.getActivity().getWaterIntake().getChange());
        assertEquals(25.0, summary.getActivity().getWaterIntake().getPercentageChange());

        // Mood assertion (6.0 -> 8.0: change = +2.0, pct = +33.33%)
        assertEquals(8.0, summary.getMood().getCurrentAverage());
        assertEquals(6.0, summary.getMood().getPreviousAverage());
        assertEquals(2.0, summary.getMood().getChange());
        assertEquals(33.33, summary.getMood().getPercentageChange());
        assertEquals("Energized", summary.getMood().getDominantMood());
    }

    @Test
    @DisplayName("Empty user data returns clean null/zero values without throwing errors")
    void getCrossDomainSummary_EmptyUserData() {
        Long userId = 2L;
        LocalDate curStart = LocalDate.of(2026, 9, 17);
        LocalDate curEnd = LocalDate.of(2026, 9, 23);

        HabitSummaryDTO emptyHabits = new HabitSummaryDTO();
        emptyHabits.setTotalHabits(0);
        emptyHabits.setActiveHabits(0);
        emptyHabits.setWeeklyCompletionPercentage(0.0);
        emptyHabits.setOverallTrend("INSUFFICIENT_DATA");
        emptyHabits.setHabits(List.of());

        when(habitAnalyticsService.getUserHabitSummary(eq(userId), any())).thenReturn(emptyHabits);
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(eq(userId), any(), any()))
                .thenReturn(List.of());
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(eq(userId), any(), any()))
                .thenReturn(List.of());
        when(experimentAnalyticsService.analyzeUserExperiments(userId)).thenReturn(List.of());

        CrossDomainAnalyticsSummaryDTO summary = service.getCrossDomainSummary(
                userId, curStart, curEnd, null, null
        );

        assertNotNull(summary);
        assertEquals(userId, summary.getUserId());
        assertEquals(0, summary.getHabits().getTotalHabits());
        assertEquals(0, summary.getHabits().getCurrentStreak());
        assertEquals(0, summary.getHabits().getLongestStreak());

        assertNull(summary.getSleep().getCurrentAverage());
        assertNull(summary.getSleep().getPreviousAverage());
        assertNull(summary.getSleep().getChange());
        assertNull(summary.getSleep().getPercentageChange());
        assertEquals(0, summary.getSleep().getCurrentRecords());
        assertEquals(0, summary.getSleep().getPreviousRecords());

        assertNull(summary.getMood().getCurrentAverage());
        assertNull(summary.getMood().getDominantMood());

        assertNull(summary.getScreenTime().getCurrentAverage());
        assertNull(summary.getActivity().getSteps().getCurrentAverage());
    }

    @Test
    @DisplayName("Zero baseline correctly yields null percentage change to prevent division by zero")
    void getCrossDomainSummary_ZeroBaseline_SafeHandling() {
        Long userId = 1L;
        LocalDate curStart = LocalDate.of(2026, 9, 17);
        LocalDate curEnd = LocalDate.of(2026, 9, 23);
        LocalDate prevStart = LocalDate.of(2026, 9, 10);
        LocalDate prevEnd = LocalDate.of(2026, 9, 16);

        User user = new User("bob", "bob@example.com", "password", "Bob", "Smith");

        when(habitAnalyticsService.getUserHabitSummary(eq(userId), eq(curEnd))).thenReturn(new HabitSummaryDTO());

        // Previous steps = 0, Current steps = 5000
        HealthData hdCur = new HealthData(user, curStart, new BigDecimal("7.0"), 7, 200, 5000, 30, 2000, null);
        HealthData hdPrev = new HealthData(user, prevStart, new BigDecimal("7.0"), 7, 200, 0, 30, 2000, null);

        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, curStart, curEnd))
                .thenReturn(List.of(hdCur));
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, prevStart, prevEnd))
                .thenReturn(List.of(hdPrev));
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(eq(userId), any(), any()))
                .thenReturn(List.of());
        when(experimentAnalyticsService.analyzeUserExperiments(userId)).thenReturn(List.of());

        CrossDomainAnalyticsSummaryDTO summary = service.getCrossDomainSummary(
                userId, curStart, curEnd, prevStart, prevEnd
        );

        MetricComparisonDTO stepComp = summary.getActivity().getSteps();
        assertEquals(5000.0, stepComp.getCurrentAverage());
        assertEquals(0.0, stepComp.getPreviousAverage());
        assertEquals(5000.0, stepComp.getChange());
        // Baseline is 0 -> percentageChange must safely be null!
        assertNull(stepComp.getPercentageChange());
    }

    @Test
    @DisplayName("Default date resolution sets previous period to immediately preceding equal duration")
    void getCrossDomainSummary_DefaultDatesCalculation() {
        Long userId = 1L;
        LocalDate curStart = LocalDate.of(2026, 9, 17);
        LocalDate curEnd = LocalDate.of(2026, 9, 23); // 7 days

        when(habitAnalyticsService.getUserHabitSummary(eq(userId), any())).thenReturn(new HabitSummaryDTO());
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(eq(userId), any(), any()))
                .thenReturn(List.of());
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(eq(userId), any(), any()))
                .thenReturn(List.of());
        when(experimentAnalyticsService.analyzeUserExperiments(userId)).thenReturn(List.of());

        CrossDomainAnalyticsSummaryDTO summary = service.getCrossDomainSummary(
                userId, curStart, curEnd, null, null
        );

        assertEquals(curStart, summary.getCurrentPeriod().getStartDate());
        assertEquals(curEnd, summary.getCurrentPeriod().getEndDate());
        // Previous period should be 2026-09-10 to 2026-09-16
        assertEquals(LocalDate.of(2026, 9, 10), summary.getPreviousPeriod().getStartDate());
        assertEquals(LocalDate.of(2026, 9, 16), summary.getPreviousPeriod().getEndDate());
    }

    @Test
    @DisplayName("Invalid current date range throws IllegalArgumentException")
    void getCrossDomainSummary_InvalidCurrentDates_ThrowsException() {
        Long userId = 1L;
        LocalDate curStart = LocalDate.of(2026, 9, 25);
        LocalDate curEnd = LocalDate.of(2026, 9, 20);

        assertThrows(IllegalArgumentException.class, () ->
                service.getCrossDomainSummary(userId, curStart, curEnd, null, null)
        );
    }

    @Test
    @DisplayName("Invalid previous date range throws IllegalArgumentException")
    void getCrossDomainSummary_InvalidPreviousDates_ThrowsException() {
        Long userId = 1L;
        LocalDate curStart = LocalDate.of(2026, 9, 20);
        LocalDate curEnd = LocalDate.of(2026, 9, 25);
        LocalDate prevStart = LocalDate.of(2026, 9, 15);
        LocalDate prevEnd = LocalDate.of(2026, 9, 10);

        assertThrows(IllegalArgumentException.class, () ->
                service.getCrossDomainSummary(userId, curStart, curEnd, prevStart, prevEnd)
        );
    }
}
