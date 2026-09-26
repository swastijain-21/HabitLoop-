package HabitLoop.backend.repository;

import HabitLoop.backend.entity.MoodEntry;
import HabitLoop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

    // Finding mood entries by user
    List<MoodEntry> findByUser(User user);

    List<MoodEntry> findByUserId(Long userId);

    // Finding mood entries by user and date range
    List<MoodEntry> findByUserAndEntryDateBetween(User user, LocalDate startDate, LocalDate endDate);

    List<MoodEntry> findByUserIdAndEntryDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
