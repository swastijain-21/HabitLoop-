package HabitLoop.backend.repository;

import HabitLoop.backend.entity.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    @Query("SELECT h FROM HealthData h WHERE h.user.id = :userId AND h.recordDate = :recordDate")
    Optional<HealthData> findByUserIdAndRecordDate(@Param("userId") Long userId, @Param("recordDate") LocalDate recordDate);

    @Query("SELECT h FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate ORDER BY h.recordDate ASC")
    List<HealthData> findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.sleepHours) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.sleepHours IS NOT NULL")
    Double findAverageSleepHours(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT MIN(h.sleepHours) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.sleepHours IS NOT NULL")
    Double findMinSleepHours(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT MAX(h.sleepHours) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.sleepHours IS NOT NULL")
    Double findMaxSleepHours(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.sleepQuality) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.sleepQuality IS NOT NULL")
    Double findAverageSleepQuality(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.screenTimeMinutes) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.screenTimeMinutes IS NOT NULL")
    Double findAverageScreenTimeMinutes(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.stepCount) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.stepCount IS NOT NULL")
    Double findAverageStepCount(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.activeMinutes) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.activeMinutes IS NOT NULL")
    Double findAverageActiveMinutes(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(h.waterIntakeMl) FROM HealthData h WHERE h.user.id = :userId AND h.recordDate BETWEEN :startDate AND :endDate AND h.waterIntakeMl IS NOT NULL")
    Double findAverageWaterIntake(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
