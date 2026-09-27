package HabitLoop.backend.controller;

import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.HabitRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitController(HabitRepository habitRepository, UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    // 1. GET /api/habits/user/{userId} -> return all habits belonging to a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Habit>> getHabitsByUserId(@PathVariable Long userId) {
        List<Habit> userHabits = habitRepository.findByUserId(userId);
        return ResponseEntity.ok(userHabits);
    }

    // 2. GET /api/habits/{id} -> return one habit
    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable Long id) {
        Optional<Habit> habit = habitRepository.findById(id);
        if (habit.isPresent()) {
            return ResponseEntity.ok(habit.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. POST /api/habits -> create a habit
    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody HabitRequest request) {
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit habit = new Habit();
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setCategory(request.getCategory() != null ? request.getCategory() : "GENERAL");
        habit.setFrequency(request.getFrequency() != null ? request.getFrequency() : "DAILY");
        habit.setTargetValue(request.getTargetValue() != null ? request.getTargetValue() : java.math.BigDecimal.valueOf(1.00));
        habit.setUnit(request.getUnit() != null ? request.getUnit() : "times");
        habit.setActive(request.getActive() != null ? request.getActive() : true);
        habit.setUser(userOptional.get());

        Habit savedHabit = habitRepository.save(habit);
        return new ResponseEntity<>(savedHabit, HttpStatus.CREATED);
    }

    // 4. PUT /api/habits/{id} -> update a habit
    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @RequestBody HabitRequest request) {
        Optional<Habit> optionalHabit = habitRepository.findById(id);
        if (optionalHabit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit habit = optionalHabit.get();
        if (request.getName() != null) {
            habit.setName(request.getName());
        }
        if (request.getDescription() != null) {
            habit.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            habit.setCategory(request.getCategory());
        }
        if (request.getFrequency() != null) {
            habit.setFrequency(request.getFrequency());
        }
        if (request.getTargetValue() != null) {
            habit.setTargetValue(request.getTargetValue());
        }
        if (request.getUnit() != null) {
            habit.setUnit(request.getUnit());
        }
        if (request.getActive() != null) {
            habit.setActive(request.getActive());
        }
        if (request.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(request.getUserId());
            if (userOptional.isPresent()) {
                habit.setUser(userOptional.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        Habit updatedHabit = habitRepository.save(habit);
        return ResponseEntity.ok(updatedHabit);
    }

    // 5. DELETE /api/habits/{id} -> delete a habit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        if (!habitRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        habitRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 6. PATCH /api/habits/{id}/toggle -> toggle the active status
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Habit> toggleHabitStatus(@PathVariable Long id) {
        Optional<Habit> optionalHabit = habitRepository.findById(id);
        if (optionalHabit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit habit = optionalHabit.get();
        boolean currentStatus = Boolean.TRUE.equals(habit.getActive());
        habit.setActive(!currentStatus);

        Habit updatedHabit = habitRepository.save(habit);
        return ResponseEntity.ok(updatedHabit);
    }

    // Inner DTO helper to accept habit request payloads with userId
    public static class HabitRequest {
        private String name;
        private String description;
        private String category = "GENERAL";
        private String frequency = "DAILY";
        private java.math.BigDecimal targetValue = java.math.BigDecimal.valueOf(1.00);
        private String unit = "times";
        private Boolean active = true;
        private Long userId;

        public HabitRequest() {
        }

        public HabitRequest(String name, String description, String frequency, Boolean active, Long userId) {
            this.name = name;
            this.description = description;
            this.frequency = frequency;
            this.active = active;
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public java.math.BigDecimal getTargetValue() {
            return targetValue;
        }

        public void setTargetValue(java.math.BigDecimal targetValue) {
            this.targetValue = targetValue;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
