package HabitLoop.backend.controller;

import HabitLoop.backend.dto.analytics.*;
import HabitLoop.backend.repository.UserRepository;
import HabitLoop.backend.service.CrossDomainAnalyticsService;
import HabitLoop.backend.service.ExperimentAnalyticsService;
import HabitLoop.backend.service.HabitAnalyticsService;
import HabitLoop.backend.service.HealthAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final HabitAnalyticsService habitAnalyticsService;
    private final HealthAnalyticsService healthAnalyticsService;
    private final ExperimentAnalyticsService experimentAnalyticsService;
    private final CrossDomainAnalyticsService crossDomainAnalyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(HabitAnalyticsService habitAnalyticsService,
                               HealthAnalyticsService healthAnalyticsService,
                               ExperimentAnalyticsService experimentAnalyticsService,
                               CrossDomainAnalyticsService crossDomainAnalyticsService,
                               UserRepository userRepository) {
        this.habitAnalyticsService = habitAnalyticsService;
        this.healthAnalyticsService = healthAnalyticsService;
        this.experimentAnalyticsService = experimentAnalyticsService;
        this.crossDomainAnalyticsService = crossDomainAnalyticsService;
        this.userRepository = userRepository;
    }

    // =========================================================================
    // 1. HABIT ANALYTICS ENDPOINTS
    // =========================================================================

    @GetMapping("/habits/user/{userId}")
    public ResponseEntity<?> getUserHabitSummary(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate referenceDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        HabitSummaryDTO summary = habitAnalyticsService.getUserHabitSummary(userId, referenceDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/habits/{habitId}")
    public ResponseEntity<?> getHabitAnalytics(@PathVariable Long habitId) {
        Optional<HabitAnalyticsDTO> habitOpt = habitAnalyticsService.getIndividualHabitAnalytics(habitId);
        if (habitOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "Habit with id " + habitId + " does not exist."));
        }
        return ResponseEntity.ok(habitOpt.get());
    }

    // =========================================================================
    // 2. HEALTH & WELLNESS ANALYTICS ENDPOINTS
    // =========================================================================

    @GetMapping("/health/overview")
    public ResponseEntity<?> getHealthOverview(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        HealthOverviewDTO overview = healthAnalyticsService.getHealthOverview(userId, startDate, endDate);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/health/sleep")
    public ResponseEntity<?> getSleepAnalytics(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        SleepAnalyticsDTO sleep = healthAnalyticsService.getSleepAnalytics(userId, startDate, endDate);
        return ResponseEntity.ok(sleep);
    }

    @GetMapping("/health/mood")
    public ResponseEntity<?> getMoodAnalytics(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        MoodAnalyticsDTO mood = healthAnalyticsService.getMoodAnalytics(userId, startDate, endDate);
        return ResponseEntity.ok(mood);
    }

    @GetMapping("/health/screentime")
    public ResponseEntity<?> getScreenTimeAnalytics(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        ScreenTimeAnalyticsDTO screenTime = healthAnalyticsService.getScreenTimeAnalytics(userId, startDate, endDate);
        return ResponseEntity.ok(screenTime);
    }

    @GetMapping("/health/activity")
    public ResponseEntity<?> getActivityAnalytics(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        ActivityAnalyticsDTO activity = healthAnalyticsService.getActivityAnalytics(userId, startDate, endDate);
        return ResponseEntity.ok(activity);
    }

    // =========================================================================
    // 3. EXPERIMENT ANALYTICS ENDPOINTS
    // =========================================================================

    @GetMapping("/experiments/{experimentId}")
    public ResponseEntity<?> getExperimentAnalytics(@PathVariable Long experimentId) {
        Optional<ExperimentAnalyticsDTO> expOpt = experimentAnalyticsService.analyzeExperiment(experimentId);
        if (expOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "Experiment with id " + experimentId + " does not exist."));
        }
        return ResponseEntity.ok(expOpt.get());
    }

    @GetMapping("/experiments/user/{userId}")
    public ResponseEntity<?> getUserExperimentsAnalytics(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        List<ExperimentAnalyticsDTO> experiments = experimentAnalyticsService.analyzeUserExperiments(userId);
        return ResponseEntity.ok(experiments);
    }

    // =========================================================================
    // 4. CROSS-DOMAIN ANALYTICS SUMMARY (GEMINI-READY)
    // =========================================================================

    @GetMapping("/summary/{userId}")
    public ResponseEntity<?> getCrossDomainSummary(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate previousStartDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate previousEndDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponseDTO(404, "Not Found", "User with id " + userId + " does not exist."));
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "startDate (" + startDate + ") cannot be after endDate (" + endDate + ")."));
        }
        if (previousStartDate != null && previousEndDate != null && previousStartDate.isAfter(previousEndDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiErrorResponseDTO(400, "Bad Request", "previousStartDate (" + previousStartDate + ") cannot be after previousEndDate (" + previousEndDate + ")."));
        }
        CrossDomainAnalyticsSummaryDTO summary = crossDomainAnalyticsService.getCrossDomainSummary(
                userId, startDate, endDate, previousStartDate, previousEndDate
        );
        return ResponseEntity.ok(summary);
    }
}
