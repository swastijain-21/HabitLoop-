package HabitLoop.backend.repository;

import HabitLoop.backend.entity.Experiment;
import HabitLoop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment, Long> {

    List<Experiment> findByUser(User user);

    List<Experiment> findByUserId(Long userId);

    List<Experiment> findByUserIdAndStatus(Long userId, String status);
}
