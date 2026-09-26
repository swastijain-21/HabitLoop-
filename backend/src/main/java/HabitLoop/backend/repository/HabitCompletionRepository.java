package HabitLoop.backend.repository;

import HabitLoop.backend.entity.Habit;
import HabitLoop.backend.entity.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {

    // 1. Find completions for a specific habit
    List<HabitCompletion> findByHabit(Habit habit);

    List<HabitCompletion> findByHabitId(Long habitId);

    // 2. Find completions for a habit between two dates
    List<HabitCompletion> findByHabitAndCompletionDateBetween(Habit habit, LocalDate startDate, LocalDate endDate);

    List<HabitCompletion> findByHabitIdAndCompletionDateBetween(Long habitId, LocalDate startDate, LocalDate endDate);

    // 3. Check whether a habit was completed on a specific date
    boolean existsByHabitAndCompletionDate(Habit habit, LocalDate completionDate);

    boolean existsByHabitIdAndCompletionDate(Long habitId, LocalDate completionDate);

    // 4. Find all completions for a list of habits
    List<HabitCompletion> findByHabitIn(List<Habit> habits);
}
