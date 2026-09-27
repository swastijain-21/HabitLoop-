package HabitLoop.backend.repository;

import HabitLoop.backend.entity.MoodEntry;
import HabitLoop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

    List<MoodEntry> findByUser(User user);

    @Query("SELECT m FROM MoodEntry m WHERE m.user.id = :userId")
    List<MoodEntry> findByUserId(@Param("userId") Long userId);

    List<MoodEntry> findByUserAndEntryDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT m FROM MoodEntry m WHERE m.user.id = :userId AND m.entryDate BETWEEN :startDate AND :endDate")
    List<MoodEntry> findByUserIdAndEntryDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
