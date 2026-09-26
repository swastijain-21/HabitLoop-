
package HabitLoop.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "habits",
    indexes = {
        @Index(name = "idx_habits_user_active",
               columnList = "user_id, is_active"),
        @Index(name = "idx_habits_category",
               columnList = "user_id, category")
    }
)
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, length = 50)
    private String category = "GENERAL";

    @Column(nullable = false, length = 30)
    private String frequency = "DAILY";

    @Column(name = "target_value", nullable = false,
            precision = 6, scale = 2)
    private BigDecimal targetValue = BigDecimal.valueOf(1.00);

    @Column(nullable = false, length = 30)
    private String unit = "times";

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Habit() {
    }

    // Original constructor: preserves compatibility
    public Habit(String name, String description,
                 String frequency, Boolean active, User user) {
        this.name = name;
        this.description = description;
        this.frequency = frequency;
        this.active = active != null ? active : true;
        this.user = user;
    }

    // Expanded constructor: supports the new frontend fields
    public Habit(User user, String name, String description,
                 String category, String frequency,
                 BigDecimal targetValue, String unit) {
        this.user = user;
        this.name = name;
        this.description = description;
        this.category = category != null ? category : "GENERAL";
        this.frequency = frequency != null ? frequency : "DAILY";
        this.targetValue = targetValue != null
                ? targetValue : BigDecimal.valueOf(1.00);
        this.unit = unit != null ? unit : "times";
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
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

    public BigDecimal getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(BigDecimal targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    // Keep both accessor styles for compatibility
    public Boolean getActive() {
        return active;
    }

    public boolean isActive() {
        return Boolean.TRUE.equals(active);
    }

    public void setActive(Boolean active) {
        this.active = active;
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