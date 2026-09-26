package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "experiments",
    indexes = {
        @Index(name = "idx_experiments_user_status", columnList = "user_id, status")
    }
)
public class Experiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String hypothesis;

    @Column(name = "target_metric", nullable = false, length = 50)
    private String targetMetric;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "before_start_date", nullable = false)
    private LocalDate beforeStartDate;

    @Column(name = "before_end_date", nullable = false)
    private LocalDate beforeEndDate;

    @Column(name = "during_start_date", nullable = false)
    private LocalDate duringStartDate;

    @Column(name = "during_end_date", nullable = false)
    private LocalDate duringEndDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Experiment() {}

    public Experiment(User user, String title, String hypothesis, String targetMetric, Habit habit,
                      String status, LocalDate beforeStartDate, LocalDate beforeEndDate,
                      LocalDate duringStartDate, LocalDate duringEndDate, String notes) {
        this.user = user;
        this.title = title;
        this.hypothesis = hypothesis;
        this.targetMetric = targetMetric;
        this.habit = habit;
        this.status = status != null ? status : "ACTIVE";
        this.beforeStartDate = beforeStartDate;
        this.beforeEndDate = beforeEndDate;
        this.duringStartDate = duringStartDate;
        this.duringEndDate = duringEndDate;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
