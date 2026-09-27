package HabitLoop.backend.repository;

import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {

    // 1. Find completions for a specific habit
    List<HabitCompletion> findByHabit(Habit habit);

    @Query("SELECT c FROM HabitCompletion c WHERE c.habit.id = :habitId")
    List<HabitCompletion> findByHabitId(@Param("habitId") Long habitId);

    // 2. Find completions for a habit between two dates
    List<HabitCompletion> findByHabitAndCompletionDateBetween(Habit habit, LocalDate startDate, LocalDate endDate);

    @Query("SELECT c FROM HabitCompletion c WHERE c.habit.id = :habitId AND c.completionDate BETWEEN :startDate AND :endDate")
    List<HabitCompletion> findByHabitIdAndCompletionDateBetween(
            @Param("habitId") Long habitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 3. Check whether a habit was completed on a specific date
    boolean existsByHabitAndCompletionDate(Habit habit, LocalDate completionDate);

    @Query("SELECT COUNT(c) > 0 FROM HabitCompletion c WHERE c.habit.id = :habitId AND c.completionDate = :completionDate")
    boolean existsByHabitIdAndCompletionDate(
            @Param("habitId") Long habitId,
            @Param("completionDate") LocalDate completionDate
    );

    // 4. Find all completions for a list of habits
    List<HabitCompletion> findByHabitIn(List<Habit> habits);
}
