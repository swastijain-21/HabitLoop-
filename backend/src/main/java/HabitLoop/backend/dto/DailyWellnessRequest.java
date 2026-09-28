package HabitLoop.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One daily wellness check-in. Upserts health_data and optionally mood_logs.
 */
public class DailyWellnessRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotNull(message = "date is required")
    private LocalDate date;

    private BigDecimal sleepHours;

    @Min(1) @Max(10)
    private Integer sleepQuality;

    private Integer screenTimeMinutes;

    private Integer stepCount;

    private Integer activeMinutes;

    private Integer waterIntakeMl;

    /** Mood score on 1–10 scale (map from UI 1–5 by multiplying by 2 if needed). */
    @Min(1) @Max(10)
    private Integer moodScore;

    private String moodLabel;

    @Min(1) @Max(10)
    private Integer energyLevel;

    @Min(1) @Max(10)
    private Integer stressLevel;

    private String notes;

    public DailyWellnessRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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
}
