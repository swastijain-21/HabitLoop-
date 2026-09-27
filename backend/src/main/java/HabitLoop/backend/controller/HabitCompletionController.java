package HabitLoop.backend.controller;

import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitCompletion;
import HabitLoop.backend.repository.HabitCompletionRepository;
import HabitLoop.backend.repository.HabitRepository;
import HabitLoop.backend.entity.HabitLog;
import HabitLoop.backend.repository.HabitLogRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/completions")
public class HabitCompletionController {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository habitCompletionRepository;
    private final HabitLogRepository habitLogRepository;

    public HabitCompletionController(HabitRepository habitRepository,
                                   HabitCompletionRepository habitCompletionRepository,
                                   HabitLogRepository habitLogRepository) {
        this.habitRepository = habitRepository;
        this.habitCompletionRepository = habitCompletionRepository;
        this.habitLogRepository = habitLogRepository;
    }

    // 1. POST /api/completions/{habitId} -> Mark the habit as completed today
    @PostMapping("/{habitId}")
    public ResponseEntity<?> markHabitCompletedToday(@PathVariable Long habitId) {
        Optional<Habit> habitOptional = habitRepository.findById(habitId);
        if (habitOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Habit not found with id: " + habitId);
        }

        LocalDate today = LocalDate.now();
        if (habitCompletionRepository.existsByHabitIdAndCompletionDate(habitId, today)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Habit already completed for today (" + today + ")");
        }

        Habit habit = habitOptional.get();
        HabitCompletion completion = new HabitCompletion(habit, today);
        HabitCompletion savedCompletion = habitCompletionRepository.save(completion);

        // Sync with canonical habit_logs
        HabitLog log = habitLogRepository.findByHabitIdAndLogDate(habitId, today)
                .orElseGet(() -> new HabitLog(habit, habit.getUser(), today, true, habit.getTargetValue(), "Completed"));
        log.setCompleted(true);
        habitLogRepository.save(log);

        return new ResponseEntity<>(savedCompletion, HttpStatus.CREATED);
    }

    // 2. GET /api/completions/habit/{habitId} -> Return completion history for the habit
    @GetMapping("/habit/{habitId}")
    public ResponseEntity<?> getCompletionsByHabitId(@PathVariable Long habitId) {
        if (!habitRepository.existsById(habitId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Habit not found with id: " + habitId);
        }

        List<HabitCompletion> completions = habitCompletionRepository.findByHabitId(habitId);
        return ResponseEntity.ok(completions);
    }

    // 3. GET /api/completions/habit/{habitId}/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    @GetMapping("/habit/{habitId}/range")
    public ResponseEntity<?> getCompletionsByRange(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!habitRepository.existsById(habitId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Habit not found with id: " + habitId);
        }

        if (startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body("startDate cannot be after endDate");
        }

        List<HabitCompletion> completions = habitCompletionRepository
                .findByHabitIdAndCompletionDateBetween(habitId, startDate, endDate);
        return ResponseEntity.ok(completions);
    }

    // 4. DELETE /api/completions/{completionId} -> Remove a completion
    @DeleteMapping("/{completionId}")
    public ResponseEntity<Void> deleteCompletion(@PathVariable Long completionId) {
        if (!habitCompletionRepository.existsById(completionId)) {
            return ResponseEntity.notFound().build();
        }

        habitCompletionRepository.deleteById(completionId);
        return ResponseEntity.noContent().build();
    }
}
