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
    Optional<HabitLog> findByHabitIdAndLogDate(Long habitId, LocalDate logDate);

    List<HabitLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    List<HabitLog> findByUserIdAndLogDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<HabitLog> findByHabitIdAndLogDateBetween(Long habitId, LocalDate startDate, LocalDate endDate);

    List<HabitLog> findByHabitIdOrderByLogDateAsc(Long habitId);

    List<HabitLog> findByHabitIdOrderByLogDateDesc(Long habitId);

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
