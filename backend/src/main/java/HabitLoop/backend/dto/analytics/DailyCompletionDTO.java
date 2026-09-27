package HabitLoop.backend.dto.analytics;

import java.time.LocalDate;

public class DailyCompletionDTO {
    private LocalDate date;
    private int totalScheduled;
    private int completedCount;
    private int incompleteCount;
    private Double completionPercentage;

    public DailyCompletionDTO() {}

    public DailyCompletionDTO(LocalDate date, int totalScheduled, int completedCount, int incompleteCount, Double completionPercentage) {
        this.date = date;
        this.totalScheduled = totalScheduled;
        this.completedCount = completedCount;
        this.incompleteCount = incompleteCount;
        this.completionPercentage = completionPercentage;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getTotalScheduled() {
        return totalScheduled;
    }

    public void setTotalScheduled(int totalScheduled) {
        this.totalScheduled = totalScheduled;
    }

    public int getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(int completedCount) {
        this.completedCount = completedCount;
    }

    public int getIncompleteCount() {
        return incompleteCount;
    }

    public void setIncompleteCount(int incompleteCount) {
        this.incompleteCount = incompleteCount;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
