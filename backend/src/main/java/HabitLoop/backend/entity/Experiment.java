
package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "experiments",
    indexes = {
        @Index(name = "idx_experiments_user_status",
               columnList = "user_id, status")
    }
)
public class Experiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String hypothesis;

    @Column(name = "target_metric", length = 50)
    private String targetMetric;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDate beforeStartDate;
    private LocalDate beforeEndDate;
    private LocalDate duringStartDate;
    private LocalDate duringEndDate;

    @Column(nullable = false, length = 30)
    private String status = "PLANNED";

    @Column(length = 2000)
    private String result;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Experiment() {
    }

    // Original constructor
    public Experiment(User user, String title, String description,
                      LocalDate startDate, LocalDate endDate,
                      String status, String hypothesis, String result) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status != null && !status.isBlank()
                ? status : "PLANNED";
        this.hypothesis = hypothesis;
        this.result = result;
    }

    // Constructor for the expanded experiment model
    public Experiment(User user, String title, String hypothesis,
                      String targetMetric, Habit habit, String status,
                      LocalDate beforeStartDate, LocalDate beforeEndDate,
                      LocalDate duringStartDate, LocalDate duringEndDate,
                      String notes) {
        this.user = user;
        this.title = title;
        this.hypothesis = hypothesis;
        this.targetMetric = targetMetric;
        this.habit = habit;
        this.status = status != null ? status : "PLANNED";
        this.beforeStartDate = beforeStartDate;
        this.beforeEndDate = beforeEndDate;
        this.duringStartDate = duringStartDate;
        this.duringEndDate = duringEndDate;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (status == null || status.isBlank()) {
            status = "PLANNED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHypothesis() {
        return hypothesis;
    }

    public void setHypothesis(String hypothesis) {
        this.hypothesis = hypothesis;
    }

    public String getTargetMetric() {
        return targetMetric;
    }

    public void setTargetMetric(String targetMetric) {
        this.targetMetric = targetMetric;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getBeforeStartDate() {
        return beforeStartDate;
    }

    public void setBeforeStartDate(LocalDate beforeStartDate) {
        this.beforeStartDate = beforeStartDate;
    }

    public LocalDate getBeforeEndDate() {
        return beforeEndDate;
    }

    public void setBeforeEndDate(LocalDate beforeEndDate) {
        this.beforeEndDate = beforeEndDate;
    }

    public LocalDate getDuringStartDate() {
        return duringStartDate;
    }

    public void setDuringStartDate(LocalDate duringStartDate) {
        this.duringStartDate = duringStartDate;
    }

    public LocalDate getDuringEndDate() {
        return duringEndDate;
    }

    public void setDuringEndDate(LocalDate duringEndDate) {
        this.duringEndDate = duringEndDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}