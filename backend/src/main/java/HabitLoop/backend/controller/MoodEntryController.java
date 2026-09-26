package HabitLoop.backend.controller;

import HabitLoop.backend.entity.MoodEntry;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.MoodEntryRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/moods")
public class MoodEntryController {

    private final MoodEntryRepository moodEntryRepository;
    private final UserRepository userRepository;

    public MoodEntryController(MoodEntryRepository moodEntryRepository, UserRepository userRepository) {
        this.moodEntryRepository = moodEntryRepository;
        this.userRepository = userRepository;
    }

    // 1. POST /api/moods -> Create a mood entry
    @PostMapping
    public ResponseEntity<?> createMoodEntry(@RequestBody MoodEntryRequest request) {
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }

        if (request.getMoodScore() == null || request.getMoodScore() < 1 || request.getMoodScore() > 5) {
            return ResponseEntity.badRequest().body("moodScore must be between 1 and 5");
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + request.getUserId());
        }

        MoodEntry moodEntry = new MoodEntry();
        moodEntry.setUser(userOptional.get());
        moodEntry.setMoodScore(request.getMoodScore());
        moodEntry.setMoodLabel(request.getMoodLabel());
        moodEntry.setNote(request.getNote());
        moodEntry.setEntryDate(request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now());

        MoodEntry savedEntry = moodEntryRepository.save(moodEntry);
        return new ResponseEntity<>(savedEntry, HttpStatus.CREATED);
    }

    // 2. GET /api/moods/user/{userId} -> Get all mood entries for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getMoodEntriesByUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + userId);
        }

        List<MoodEntry> entries = moodEntryRepository.findByUserId(userId);
        return ResponseEntity.ok(entries);
    }

    // 3. GET /api/moods/user/{userId}/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD -> Get mood entries within a date range
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<?> getMoodEntriesByRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + userId);
        }

        if (startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body("startDate cannot be after endDate");
        }

        List<MoodEntry> entries = moodEntryRepository.findByUserIdAndEntryDateBetween(userId, startDate, endDate);
        return ResponseEntity.ok(entries);
    }

    // 4. PUT /api/moods/{id} -> Update a mood entry
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMoodEntry(@PathVariable Long id, @RequestBody MoodEntryRequest request) {
        Optional<MoodEntry> optionalEntry = moodEntryRepository.findById(id);
        if (optionalEntry.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("MoodEntry not found with id: " + id);
        }

        MoodEntry moodEntry = optionalEntry.get();

        if (request.getMoodScore() != null) {
            if (request.getMoodScore() < 1 || request.getMoodScore() > 5) {
                return ResponseEntity.badRequest().body("moodScore must be between 1 and 5");
            }
            moodEntry.setMoodScore(request.getMoodScore());
        }

        if (request.getMoodLabel() != null) {
            moodEntry.setMoodLabel(request.getMoodLabel());
        }

        if (request.getNote() != null) {
            moodEntry.setNote(request.getNote());
        }

        if (request.getEntryDate() != null) {
            moodEntry.setEntryDate(request.getEntryDate());
        }

        if (request.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(request.getUserId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + request.getUserId());
            }
            moodEntry.setUser(userOptional.get());
        }

        MoodEntry updatedEntry = moodEntryRepository.save(moodEntry);
        return ResponseEntity.ok(updatedEntry);
    }

    // 5. DELETE /api/moods/{id} -> Delete a mood entry
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMoodEntry(@PathVariable Long id) {
        if (!moodEntryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        moodEntryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Inner DTO for receiving mood entry request payloads
    public static class MoodEntryRequest {
        private Long userId;
        private Integer moodScore;
        private String moodLabel;
        private String note;
        private LocalDate entryDate;

        public MoodEntryRequest() {
        }

        public MoodEntryRequest(Long userId, Integer moodScore, String moodLabel, String note, LocalDate entryDate) {
            this.userId = userId;
            this.moodScore = moodScore;
            this.moodLabel = moodLabel;
            this.note = note;
            this.entryDate = entryDate;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Integer getMoodScore() {
            return moodScore;
        }

        public void setMoodScore(Integer moodScore) {
            this.moodScore = moodScore;
        }

        public String getMoodLabel() {
            return moodLabel;
        }

        public void setMoodLabel(String moodLabel) {
            this.moodLabel = moodLabel;
        }

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }

        public LocalDate getEntryDate() {
            return entryDate;
        }

        public void setEntryDate(LocalDate entryDate) {
            this.entryDate = entryDate;
        }
    }
}
