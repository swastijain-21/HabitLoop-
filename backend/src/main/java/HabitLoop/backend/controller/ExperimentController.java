package HabitLoop.backend.controller;

import HabitLoop.backend.entity.Experiment;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.ExperimentRepository;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    private final ExperimentRepository experimentRepository;
    private final UserRepository userRepository;

    public ExperimentController(ExperimentRepository experimentRepository, UserRepository userRepository) {
        this.experimentRepository = experimentRepository;
        this.userRepository = userRepository;
    }

    // 1. POST /api/experiments -> Create an experiment
    @PostMapping
    public ResponseEntity<?> createExperiment(@RequestBody ExperimentRequest request) {
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("title is required");
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + request.getUserId());
        }

        String status = "PLANNED";
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            String normalizedStatus = request.getStatus().trim().toUpperCase();
            if (!isValidStatus(normalizedStatus)) {
                return ResponseEntity.badRequest().body("Invalid status. Allowed values: PLANNED, ACTIVE, COMPLETED");
            }
            status = normalizedStatus;
        }

        Experiment experiment = new Experiment();
        experiment.setUser(userOptional.get());
        experiment.setTitle(request.getTitle());
        experiment.setDescription(request.getDescription());
        experiment.setStartDate(request.getStartDate());
        experiment.setEndDate(request.getEndDate());
        experiment.setStatus(status);
        experiment.setHypothesis(request.getHypothesis());
        experiment.setResult(request.getResult());

        Experiment savedExperiment = experimentRepository.save(experiment);
        return new ResponseEntity<>(savedExperiment, HttpStatus.CREATED);
    }

    // 2. GET /api/experiments/user/{userId} -> Get all experiments for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getExperimentsByUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + userId);
        }

        List<Experiment> experiments = experimentRepository.findByUserId(userId);
        return ResponseEntity.ok(experiments);
    }

    // 3. GET /api/experiments/{id} -> Get experiment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getExperimentById(@PathVariable Long id) {
        Optional<Experiment> optionalExperiment = experimentRepository.findById(id);
        if (optionalExperiment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experiment not found with id: " + id);
        }

        return ResponseEntity.ok(optionalExperiment.get());
    }

    // 4. PUT /api/experiments/{id} -> Update an experiment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperiment(@PathVariable Long id, @RequestBody ExperimentRequest request) {
        Optional<Experiment> optionalExperiment = experimentRepository.findById(id);
        if (optionalExperiment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experiment not found with id: " + id);
        }

        Experiment experiment = optionalExperiment.get();

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            experiment.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            experiment.setDescription(request.getDescription());
        }

        if (request.getStartDate() != null) {
            experiment.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            experiment.setEndDate(request.getEndDate());
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            String normalizedStatus = request.getStatus().trim().toUpperCase();
            if (!isValidStatus(normalizedStatus)) {
                return ResponseEntity.badRequest().body("Invalid status. Allowed values: PLANNED, ACTIVE, COMPLETED");
            }
            experiment.setStatus(normalizedStatus);
        }

        if (request.getHypothesis() != null) {
            experiment.setHypothesis(request.getHypothesis());
        }

        if (request.getResult() != null) {
            experiment.setResult(request.getResult());
        }

        if (request.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(request.getUserId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + request.getUserId());
            }
            experiment.setUser(userOptional.get());
        }

        Experiment updatedExperiment = experimentRepository.save(experiment);
        return ResponseEntity.ok(updatedExperiment);
    }

    // 5. DELETE /api/experiments/{id} -> Delete an experiment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperiment(@PathVariable Long id) {
        if (!experimentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        experimentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 6. PATCH /api/experiments/{id}/status -> Update status (PLANNED, ACTIVE, COMPLETED)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateExperimentStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) StatusUpdateRequest statusUpdateRequest) {
        Optional<Experiment> optionalExperiment = experimentRepository.findById(id);
        if (optionalExperiment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experiment not found with id: " + id);
        }

        String newStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            newStatus = status.trim().toUpperCase();
        } else if (statusUpdateRequest != null && statusUpdateRequest.getStatus() != null) {
            newStatus = statusUpdateRequest.getStatus().trim().toUpperCase();
        }

        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required (PLANNED, ACTIVE, or COMPLETED)");
        }

        if (!isValidStatus(newStatus)) {
            return ResponseEntity.badRequest().body("Invalid status. Allowed values: PLANNED, ACTIVE, COMPLETED");
        }

        Experiment experiment = optionalExperiment.get();
        experiment.setStatus(newStatus);
        Experiment savedExperiment = experimentRepository.save(experiment);
        return ResponseEntity.ok(savedExperiment);
    }

    private boolean isValidStatus(String status) {
        return "PLANNED".equals(status) || "ACTIVE".equals(status) || "COMPLETED".equals(status);
    }

    // Static DTO for experiment requests
    public static class ExperimentRequest {
        private Long userId;
        private String title;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String hypothesis;
        private String result;

        public ExperimentRequest() {}

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getHypothesis() { return hypothesis; }
        public void setHypothesis(String hypothesis) { this.hypothesis = hypothesis; }

        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }
    }

    // Static DTO for status update PATCH request
    public static class StatusUpdateRequest {
        private String status;

        public StatusUpdateRequest() {}

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
