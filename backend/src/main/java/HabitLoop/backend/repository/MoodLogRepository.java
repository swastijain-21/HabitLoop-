package HabitLoop.backend.repository;

import HabitLoop.backend.entity.MoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoodLogRepository extends JpaRepository<MoodLog, Long> {
    Optional<MoodLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    List<MoodLog> findByUserIdAndLogDateBetweenOrderByLogDateAsc(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT AVG(m.score) FROM MoodLog m WHERE m.user.id = :userId AND m.logDate BETWEEN :startDate AND :endDate")
    Double findAverageScoreByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(m.energyLevel) FROM MoodLog m WHERE m.user.id = :userId AND m.logDate BETWEEN :startDate AND :endDate AND m.energyLevel IS NOT NULL")
    Double findAverageEnergyByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT AVG(m.stressLevel) FROM MoodLog m WHERE m.user.id = :userId AND m.logDate BETWEEN :startDate AND :endDate AND m.stressLevel IS NOT NULL")
    Double findAverageStressByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
