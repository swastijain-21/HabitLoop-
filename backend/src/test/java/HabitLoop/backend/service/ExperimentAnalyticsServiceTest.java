package HabitLoop.backend.service;

import HabitLoop.backend.dto.analytics.ExperimentAnalyticsDTO;
import HabitLoop.backend.dto.analytics.MetricComparisonDTO;
import HabitLoop.backend.entity.*;
import HabitLoop.backend.repository.ExperimentRepository;
import HabitLoop.backend.repository.HabitLogRepository;
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
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExperimentAnalyticsServiceTest {

    @Mock
    private ExperimentRepository experimentRepository;

    @Mock
    private HealthDataRepository healthDataRepository;

    @Mock
    private MoodLogRepository moodLogRepository;

    @Mock
    private HabitLogRepository habitLogRepository;

    private AnalyticsCalculationHelper calcHelper;
    private ExperimentAnalyticsService service;

    @BeforeEach
    void setUp() {
        calcHelper = new AnalyticsCalculationHelper();
        service = new ExperimentAnalyticsService(
                experimentRepository,
                healthDataRepository,
                moodLogRepository,
                habitLogRepository,
                calcHelper
        );
    }

    @Test
    @DisplayName("Experiment evaluation calculates primary target metric and multi-metric breakdown")
    void calculateExperimentMetrics_Success() {
        User user = new User("alice", "alice@test.com", "pass", "Alice", "Smith");
        user.setId(1L);
        Habit habit = new Habit(user, "Meditate", "Daily meditation", "MINDFULNESS", "DAILY", new BigDecimal("10.0"), "minutes");
        habit.setId(10L);

        LocalDate bStart = LocalDate.of(2026, 9, 10);
        LocalDate bEnd = LocalDate.of(2026, 9, 16);
        LocalDate dStart = LocalDate.of(2026, 9, 17);
        LocalDate dEnd = LocalDate.of(2026, 9, 23);

        Experiment exp = new Experiment(
                user, "Digital Sunset", "Screen cut off improves sleep",
                "SLEEP_HOURS", habit, "ACTIVE",
                bStart, bEnd, dStart, dEnd, null
        );

        // Baseline health data
        HealthData hdBase = new HealthData(user, bStart, new BigDecimal("6.0"), 6, 350, 8000, 30, 2000, null);
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(any(), eq(bStart), eq(bEnd)))
                .thenReturn(List.of(hdBase));

        // During health data
        HealthData hdDuring = new HealthData(user, dStart, new BigDecimal("7.5"), 8, 250, 10000, 45, 2500, null);
        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(any(), eq(dStart), eq(dEnd)))
                .thenReturn(List.of(hdDuring));

        // Baseline & during mood
        MoodLog mlBase = new MoodLog(user, bStart, 6, "Tired", 4, 7, null);
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(any(), eq(bStart), eq(bEnd)))
                .thenReturn(List.of(mlBase));

        MoodLog mlDuring = new MoodLog(user, dStart, 8, "Energized", 7, 3, null);
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(any(), eq(dStart), eq(dEnd)))
                .thenReturn(List.of(mlDuring));

        // Habit completions
        HabitLog hlBase = new HabitLog(habit, user, bStart, true, new BigDecimal("10.0"), null);
        when(habitLogRepository.findByHabitIdAndLogDateBetween(any(), eq(bStart), eq(bEnd)))
                .thenReturn(List.of(hlBase));

        HabitLog hlDuring = new HabitLog(habit, user, dStart, true, new BigDecimal("10.0"), null);
        when(habitLogRepository.findByHabitIdAndLogDateBetween(any(), eq(dStart), eq(dEnd)))
                .thenReturn(List.of(hlDuring));

        when(experimentRepository.findById(1L)).thenReturn(Optional.of(exp));

        Optional<ExperimentAnalyticsDTO> optResult = service.analyzeExperiment(1L);
        assertTrue(optResult.isPresent());
        ExperimentAnalyticsDTO result = optResult.get();

        // Target metric
        assertEquals("SLEEP_HOURS", result.getTargetMetric());
        assertEquals(6.0, result.getBeforeAverage());
        assertEquals(7.5, result.getDuringAverage());
        assertEquals(1.5, result.getAbsoluteChange());
        assertEquals(25.0, result.getPercentageChange());

        // Multi-metric breakdown verification
        Map<String, MetricComparisonDTO> metrics = result.getMetrics();
        assertNotNull(metrics);
        assertTrue(metrics.containsKey("sleep"));
        assertTrue(metrics.containsKey("mood"));
        assertTrue(metrics.containsKey("screenTime"));
        assertTrue(metrics.containsKey("steps"));
        assertTrue(metrics.containsKey("activeMinutes"));
        assertTrue(metrics.containsKey("waterIntake"));
        assertTrue(metrics.containsKey("habitCompletion"));

        // Verify sleep
        MetricComparisonDTO sleepComp = metrics.get("sleep");
        assertEquals(7.5, sleepComp.getCurrentAverage());
        assertEquals(6.0, sleepComp.getPreviousAverage());
        assertEquals(1.5, sleepComp.getChange());
        assertEquals(25.0, sleepComp.getPercentageChange());

        // Verify mood
        MetricComparisonDTO moodComp = metrics.get("mood");
        assertEquals(8.0, moodComp.getCurrentAverage());
        assertEquals(6.0, moodComp.getPreviousAverage());
        assertEquals(2.0, moodComp.getChange());
        assertEquals(33.33, moodComp.getPercentageChange());

        // Verify screenTime (350 -> 250: -100 mins, -28.57%)
        MetricComparisonDTO screenComp = metrics.get("screenTime");
        assertEquals(250.0, screenComp.getCurrentAverage());
        assertEquals(350.0, screenComp.getPreviousAverage());
        assertEquals(-100.0, screenComp.getChange());
        assertEquals(-28.57, screenComp.getPercentageChange());
    }

    @Test
    @DisplayName("Experiment without linked habit does not include habitCompletion metric")
    void calculateExperimentMetrics_WithoutLinkedHabit() {
        User user = new User("alice", "alice@test.com", "pass", "Alice", "Smith");
        user.setId(1L);

        LocalDate bStart = LocalDate.of(2026, 9, 10);
        LocalDate bEnd = LocalDate.of(2026, 9, 16);
        LocalDate dStart = LocalDate.of(2026, 9, 17);
        LocalDate dEnd = LocalDate.of(2026, 9, 23);

        Experiment exp = new Experiment(
                user, "Sleep Routine", "Hypothesis",
                "SLEEP_HOURS", null, "ACTIVE",
                bStart, bEnd, dStart, dEnd, null
        );

        when(healthDataRepository.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(any(), any(), any()))
                .thenReturn(List.of());
        when(moodLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateAsc(any(), any(), any()))
                .thenReturn(List.of());

        ExperimentAnalyticsDTO result = service.calculateExperimentMetrics(exp);
        assertNotNull(result);
        assertNotNull(result.getMetrics());
        assertFalse(result.getMetrics().containsKey("habitCompletion"));
    }
}
