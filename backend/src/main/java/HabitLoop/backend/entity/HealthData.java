package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "health_data",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_health_data_user_date", columnNames = {"user_id", "record_date"})
    },
    indexes = {
        @Index(name = "idx_health_data_user_date", columnList = "user_id, record_date")
    }
)
public class HealthData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "sleep_hours", precision = 4, scale = 2)
    private BigDecimal sleepHours;

    @Column(name = "sleep_quality")
    private Integer sleepQuality; // 1 to 10

    @Column(name = "screen_time_minutes")
    private Integer screenTimeMinutes;

    @Column(name = "step_count")
    private Integer stepCount;

    @Column(name = "active_minutes")
    private Integer activeMinutes;

    @Column(name = "water_intake_ml")
    private Integer waterIntakeMl;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public HealthData() {}

    public HealthData(User user, LocalDate recordDate, BigDecimal sleepHours, Integer sleepQuality,
                      Integer screenTimeMinutes, Integer stepCount, Integer activeMinutes,
                      Integer waterIntakeMl, String notes) {
        this.user = user;
        this.recordDate = recordDate;
        this.sleepHours = sleepHours;
        this.sleepQuality = sleepQuality;
        this.screenTimeMinutes = screenTimeMinutes;
        this.stepCount = stepCount;
        this.activeMinutes = activeMinutes;
        this.waterIntakeMl = waterIntakeMl;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public BigDecimal getSleepHours() {
        return sleepHours;
    }

    public void setSleepHours(BigDecimal sleepHours) {
        this.sleepHours = sleepHours;
    }

    public Integer getSleepQuality() {
        return sleepQuality;
    }

    public void setSleepQuality(Integer sleepQuality) {
        this.sleepQuality = sleepQuality;
    }

    public Integer getScreenTimeMinutes() {
        return screenTimeMinutes;
    }

    public void setScreenTimeMinutes(Integer screenTimeMinutes) {
        this.screenTimeMinutes = screenTimeMinutes;
    }

    public Integer getStepCount() {
        return stepCount;
    }

    public void setStepCount(Integer stepCount) {
        this.stepCount = stepCount;
    }

    public Integer getActiveMinutes() {
        return activeMinutes;
    }

    public void setActiveMinutes(Integer activeMinutes) {
        this.activeMinutes = activeMinutes;
    }

    public Integer getWaterIntakeMl() {
        return waterIntakeMl;
    }

    public void setWaterIntakeMl(Integer waterIntakeMl) {
        this.waterIntakeMl = waterIntakeMl;
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
}
