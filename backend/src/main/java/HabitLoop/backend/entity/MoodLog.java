package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "mood_logs",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_mood_logs_user_date", columnNames = {"user_id", "log_date"})
    },
    indexes = {
        @Index(name = "idx_mood_logs_user_date", columnList = "user_id, log_date")
    }
)
public class MoodLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private Integer score; // 1 to 10

    @Column(name = "mood_label", length = 50)
    private String moodLabel;

    @Column(name = "energy_level")
    private Integer energyLevel; // 1 to 10

    @Column(name = "stress_level")
    private Integer stressLevel; // 1 to 10

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MoodLog() {}

    public MoodLog(User user, LocalDate logDate, Integer score, String moodLabel, Integer energyLevel, Integer stressLevel, String notes) {
        this.user = user;
        this.logDate = logDate;
        this.score = score;
        this.moodLabel = moodLabel;
        this.energyLevel = energyLevel;
        this.stressLevel = stressLevel;
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

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getMoodLabel() {
        return moodLabel;
    }

    public void setMoodLabel(String moodLabel) {
        this.moodLabel = moodLabel;
    }

    public Integer getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(Integer energyLevel) {
        this.energyLevel = energyLevel;
    }

    public Integer getStressLevel() {
        return stressLevel;
    }

    public void setStressLevel(Integer stressLevel) {
        this.stressLevel = stressLevel;
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
