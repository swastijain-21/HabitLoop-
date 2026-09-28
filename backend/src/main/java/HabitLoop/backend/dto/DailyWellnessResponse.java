package HabitLoop.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyWellnessResponse {

    private Long userId;
    private LocalDate date;
    private Long healthDataId;
    private Long moodLogId;
    private BigDecimal sleepHours;
    private Integer sleepQuality;
    private Integer screenTimeMinutes;
    private Integer stepCount;
    private Integer activeMinutes;
    private Integer waterIntakeMl;
    private Integer moodScore;
    private String moodLabel;
    private Integer energyLevel;
    private Integer stressLevel;
    private String notes;

    public DailyWellnessResponse() {
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

    public Long getHealthDataId() {
        return healthDataId;
    }

    public void setHealthDataId(Long healthDataId) {
        this.healthDataId = healthDataId;
    }

    public Long getMoodLogId() {
        return moodLogId;
    }

    public void setMoodLogId(Long moodLogId) {
        this.moodLogId = moodLogId;
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
