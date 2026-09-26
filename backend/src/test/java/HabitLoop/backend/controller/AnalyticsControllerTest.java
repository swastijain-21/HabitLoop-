package HabitLoop.backend.controller;

import HabitLoop.backend.dto.analytics.*;
import HabitLoop.backend.exception.GlobalExceptionHandler;
import HabitLoop.backend.repository.UserRepository;
import HabitLoop.backend.service.ExperimentAnalyticsService;
import HabitLoop.backend.service.HabitAnalyticsService;
import HabitLoop.backend.service.HealthAnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HabitAnalyticsService habitAnalyticsService;

    @Mock
    private HealthAnalyticsService healthAnalyticsService;

    @Mock
    private ExperimentAnalyticsService experimentAnalyticsService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        AnalyticsController controller = new AnalyticsController(
                habitAnalyticsService,
                healthAnalyticsService,
                experimentAnalyticsService,
                userRepository
        );
        this.mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/analytics/habits/user/{userId} - Success")
    void getUserHabitSummary_Success() throws Exception {
        Long userId = 1L;
        HabitSummaryDTO mockSummary = new HabitSummaryDTO();
        mockSummary.setUserId(userId);
        mockSummary.setTotalHabits(4);
        mockSummary.setActiveHabits(4);
        mockSummary.setCompletedToday(3);
        mockSummary.setCompletionPercentageToday(75.0);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(habitAnalyticsService.getUserHabitSummary(eq(userId), any())).thenReturn(mockSummary);

        mockMvc.perform(get("/api/analytics/habits/user/{userId}", userId)
                        .param("referenceDate", "2026-09-23")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.totalHabits").value(4))
                .andExpect(jsonPath("$.completedToday").value(3))
                .andExpect(jsonPath("$.completionPercentageToday").value(75.0));
    }

    @Test
    @DisplayName("GET /api/analytics/habits/user/{userId} - User Not Found (404)")
    void getUserHabitSummary_NotFound() throws Exception {
        Long userId = 999L;
        when(userRepository.existsById(userId)).thenReturn(false);

        mockMvc.perform(get("/api/analytics/habits/user/{userId}", userId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    @DisplayName("GET /api/analytics/habits/{habitId} - Success")
    void getHabitAnalytics_Success() throws Exception {
        Long habitId = 1L;
        HabitAnalyticsDTO dto = new HabitAnalyticsDTO();
        dto.setHabitId(habitId);
        dto.setHabitName("Morning Meditation");
        dto.setCompletionRatePercentage(92.86);
        dto.setCurrentStreak(11);

        when(habitAnalyticsService.getIndividualHabitAnalytics(habitId)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/analytics/habits/{habitId}", habitId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.habitId").value(1))
                .andExpect(jsonPath("$.habitName").value("Morning Meditation"))
                .andExpect(jsonPath("$.completionRatePercentage").value(92.86))
                .andExpect(jsonPath("$.currentStreak").value(11));
    }

    @Test
    @DisplayName("GET /api/analytics/habits/{habitId} - Habit Not Found (404)")
    void getHabitAnalytics_NotFound() throws Exception {
        Long habitId = 999L;
        when(habitAnalyticsService.getIndividualHabitAnalytics(habitId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/analytics/habits/{habitId}", habitId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("GET /api/analytics/health/sleep - Success")
    void getSleepAnalytics_Success() throws Exception {
        Long userId = 1L;
        LocalDate start = LocalDate.of(2026, 9, 10);
        LocalDate end = LocalDate.of(2026, 9, 16);

        SleepAnalyticsDTO sleep = new SleepAnalyticsDTO(
                6.16, 5.5, 7.0, 5.29, 7, "IMPROVING", null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getSleepAnalytics(userId, start, end)).thenReturn(sleep);

        mockMvc.perform(get("/api/analytics/health/sleep")
                        .param("userId", "1")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-16")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageSleepHours").value(6.16))
                .andExpect(jsonPath("$.minSleepHours").value(5.5))
                .andExpect(jsonPath("$.maxSleepHours").value(7.0))
                .andExpect(jsonPath("$.totalRecords").value(7))
                .andExpect(jsonPath("$.trend").value("IMPROVING"));
    }

    @Test
    @DisplayName("GET /api/analytics/health/mood - Success")
    void getMoodAnalytics_Success() throws Exception {
        Long userId = 1L;
        LocalDate start = LocalDate.of(2026, 9, 10);
        LocalDate end = LocalDate.of(2026, 9, 16);

        MoodAnalyticsDTO mood = new MoodAnalyticsDTO(
                6.0, 5, 7, 4.86, 6.86, "Tired", 7, "STABLE", null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getMoodAnalytics(userId, start, end)).thenReturn(mood);

        mockMvc.perform(get("/api/analytics/health/mood")
                        .param("userId", "1")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-16")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageScore").value(6.0))
                .andExpect(jsonPath("$.minScore").value(5))
                .andExpect(jsonPath("$.maxScore").value(7))
                .andExpect(jsonPath("$.dominantMoodLabel").value("Tired"));
    }

    @Test
    @DisplayName("GET /api/analytics/health/screentime - Success")
    void getScreenTimeAnalytics_Success() throws Exception {
        Long userId = 1L;
        LocalDate start = LocalDate.of(2026, 9, 10);
        LocalDate end = LocalDate.of(2026, 9, 16);

        ScreenTimeAnalyticsDTO screen = new ScreenTimeAnalyticsDTO(
                385.71, 45.0, 310, 430, 7, "DECLINING", null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getScreenTimeAnalytics(userId, start, end)).thenReturn(screen);

        mockMvc.perform(get("/api/analytics/health/screentime")
                        .param("userId", "1")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-16")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageMinutes").value(385.71))
                .andExpect(jsonPath("$.totalHours").value(45.0));
    }

    @Test
    @DisplayName("GET /api/analytics/health/activity - Success")
    void getActivityAnalytics_Success() throws Exception {
        Long userId = 2L;
        LocalDate start = LocalDate.of(2026, 9, 17);
        LocalDate end = LocalDate.of(2026, 9, 23);

        ActivityAnalyticsDTO act = new ActivityAnalyticsDTO(
                10842.86, 75900L, 6000, 13500, 50.71, 355, 2742.86, 7, "STABLE", null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getActivityAnalytics(userId, start, end)).thenReturn(act);

        mockMvc.perform(get("/api/analytics/health/activity")
                        .param("userId", "2")
                        .param("startDate", "2026-09-17")
                        .param("endDate", "2026-09-23")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageSteps").value(10842.86))
                .andExpect(jsonPath("$.totalSteps").value(75900))
                .andExpect(jsonPath("$.averageWaterMl").value(2742.86));
    }

    @Test
    @DisplayName("GET /api/analytics/health/overview - Success")
    void getHealthOverview_Success() throws Exception {
        Long userId = 1L;
        LocalDate start = LocalDate.of(2026, 9, 10);
        LocalDate end = LocalDate.of(2026, 9, 16);

        HealthOverviewDTO overview = new HealthOverviewDTO(
                userId, start, end, null, null, null, null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getHealthOverview(userId, start, end)).thenReturn(overview);

        mockMvc.perform(get("/api/analytics/health/overview")
                        .param("userId", "1")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-16")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    @DisplayName("Health endpoint with invalid date range (startDate > endDate) returns 400 Bad Request")
    void getHealthAnalytics_InvalidDateRange() throws Exception {
        Long userId = 1L;
        when(userRepository.existsById(userId)).thenReturn(true);

        mockMvc.perform(get("/api/analytics/health/sleep")
                        .param("userId", "1")
                        .param("startDate", "2026-09-20")
                        .param("endDate", "2026-09-10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @DisplayName("GET /api/analytics/experiments/{experimentId} - Success")
    void getExperimentAnalytics_Success() throws Exception {
        Long expId = 1L;
        ExperimentAnalyticsDTO dto = new ExperimentAnalyticsDTO();
        dto.setExperimentId(expId);
        dto.setTitle("Digital Sunset: No Phone After 9 PM");
        dto.setTargetMetric("SLEEP_HOURS");
        dto.setBeforeAverage(6.16);
        dto.setDuringAverage(7.74);
        dto.setAbsoluteChange(1.58);
        dto.setPercentageChange(25.65);
        dto.setDirection("INCREASE");

        when(experimentAnalyticsService.analyzeExperiment(expId)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/analytics/experiments/{experimentId}", expId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.experimentId").value(1))
                .andExpect(jsonPath("$.title").value("Digital Sunset: No Phone After 9 PM"))
                .andExpect(jsonPath("$.beforeAverage").value(6.16))
                .andExpect(jsonPath("$.duringAverage").value(7.74))
                .andExpect(jsonPath("$.absoluteChange").value(1.58))
                .andExpect(jsonPath("$.direction").value("INCREASE"));
    }

    @Test
    @DisplayName("GET /api/analytics/experiments/{experimentId} - Not Found (404)")
    void getExperimentAnalytics_NotFound() throws Exception {
        Long expId = 999L;
        when(experimentAnalyticsService.analyzeExperiment(expId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/analytics/experiments/{experimentId}", expId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("GET /api/analytics/experiments/user/{userId} - Success")
    void getUserExperimentsAnalytics_Success() throws Exception {
        Long userId = 1L;
        when(userRepository.existsById(userId)).thenReturn(true);
        when(experimentAnalyticsService.analyzeUserExperiments(userId)).thenReturn(List.of());

        mockMvc.perform(get("/api/analytics/experiments/user/{userId}", userId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Empty data returns 200 OK with default/empty DTO")
    void getHealthAnalytics_EmptyData_Returns200() throws Exception {
        Long userId = 3L; // User with no records
        LocalDate start = LocalDate.of(2026, 9, 10);
        LocalDate end = LocalDate.of(2026, 9, 16);

        SleepAnalyticsDTO emptySleep = new SleepAnalyticsDTO(
                null, null, null, null, 0, "INSUFFICIENT_DATA", null
        );

        when(userRepository.existsById(userId)).thenReturn(true);
        when(healthAnalyticsService.getSleepAnalytics(userId, start, end)).thenReturn(emptySleep);

        mockMvc.perform(get("/api/analytics/health/sleep")
                        .param("userId", "3")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-16")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRecords").value(0))
                .andExpect(jsonPath("$.trend").value("INSUFFICIENT_DATA"));
    }
}
