package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "habit_logs",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_habit_logs_date", columnNames = {"habit_id", "log_date"})
    },
    indexes = {
        @Index(name = "idx_habit_logs_user_date", columnList = "user_id, log_date"),
        @Index(name = "idx_habit_logs_habit_date", columnList = "habit_id, log_date")
    }
)
public class HabitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private boolean completed = true;

    @Column(name = "logged_value", nullable = false, precision = 6, scale = 2)
    private BigDecimal loggedValue = BigDecimal.valueOf(1.00);

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public HabitLog() {}

    public HabitLog(Habit habit, User user, LocalDate logDate, boolean completed, BigDecimal loggedValue, String notes) {
        this.habit = habit;
        this.user = user;
        this.logDate = logDate;
        this.completed = completed;
        this.loggedValue = loggedValue != null ? loggedValue : BigDecimal.valueOf(1.00);
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

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public BigDecimal getLoggedValue() {
        return loggedValue;
    }

    public void setLoggedValue(BigDecimal loggedValue) {
        this.loggedValue = loggedValue;
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
