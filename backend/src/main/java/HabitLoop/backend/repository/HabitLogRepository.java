package HabitLoop.backend.repository;

import HabitLoop.backend.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.logDate = :logDate")
    Optional<HabitLog> findByHabitIdAndLogDate(@Param("habitId") Long habitId, @Param("logDate") LocalDate logDate);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.user.id = :userId")
    List<HabitLog> findByUserId(@Param("userId") Long userId);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.user.id = :userId AND hl.logDate = :logDate")
    List<HabitLog> findByUserIdAndLogDate(@Param("userId") Long userId, @Param("logDate") LocalDate logDate);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.user.id = :userId AND hl.logDate BETWEEN :startDate AND :endDate")
    List<HabitLog> findByUserIdAndLogDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.logDate BETWEEN :startDate AND :endDate")
    List<HabitLog> findByHabitIdAndLogDateBetween(
            @Param("habitId") Long habitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId ORDER BY hl.logDate ASC")
    List<HabitLog> findByHabitIdOrderByLogDateAsc(@Param("habitId") Long habitId);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId ORDER BY hl.logDate DESC")
    List<HabitLog> findByHabitIdOrderByLogDateDesc(@Param("habitId") Long habitId);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.completed = true")
    long countCompletedByHabitId(@Param("habitId") Long habitId);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId")
    long countTotalByHabitId(@Param("habitId") Long habitId);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.user.id = :userId AND hl.logDate = :logDate AND hl.completed = true")
    long countCompletedByUserIdAndLogDate(@Param("userId") Long userId, @Param("logDate") LocalDate logDate);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.completed = true AND hl.logDate BETWEEN :startDate AND :endDate")
    long countCompletedByHabitIdAndDateRange(
            @Param("habitId") Long habitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.logDate BETWEEN :startDate AND :endDate")
    long countTotalByHabitIdAndDateRange(
            @Param("habitId") Long habitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
