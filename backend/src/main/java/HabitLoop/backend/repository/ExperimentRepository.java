package HabitLoop.backend.repository;

import HabitLoop.backend.entity.Experiment;
import HabitLoop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment, Long> {

    List<Experiment> findByUser(User user);

    @Query("SELECT e FROM Experiment e WHERE e.user.id = :userId")
    List<Experiment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT e FROM Experiment e WHERE e.user.id = :userId AND e.status = :status")
    List<Experiment> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
}
