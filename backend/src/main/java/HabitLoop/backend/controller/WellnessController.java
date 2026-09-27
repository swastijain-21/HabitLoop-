package HabitLoop.backend.controller;

import HabitLoop.backend.dto.DailyWellnessRequest;
import HabitLoop.backend.dto.DailyWellnessResponse;
import HabitLoop.backend.service.WellnessService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wellness")
public class WellnessController {

    private final WellnessService wellnessService;

    public WellnessController(WellnessService wellnessService) {
        this.wellnessService = wellnessService;
    }

    /**
     * Create or update one day's health_data (+ mood_logs when moodScore is sent).
     */
    @org.springframework.web.bind.annotation.RequestMapping(
            value = "/daily",
            method = {org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.POST}
    )
    public ResponseEntity<DailyWellnessResponse> upsertDaily(@Valid @RequestBody DailyWellnessRequest request) {
        DailyWellnessResponse saved = wellnessService.upsertDaily(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DailyWellnessResponse>> getRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(wellnessService.getRange(userId, startDate, endDate));
    }

    @GetMapping("/user/{userId}/day")
    public ResponseEntity<?> getOneDay(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Optional<DailyWellnessResponse> day = wellnessService.getOneDay(userId, date);
        return day.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        java.util.Map.of("status", 404, "error", "Not Found",
                                "message", "No wellness data for " + date)));
    }
}
