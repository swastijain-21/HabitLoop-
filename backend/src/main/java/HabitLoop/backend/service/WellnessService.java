package HabitLoop.backend.service;

import HabitLoop.backend.dto.DailyWellnessRequest;
import HabitLoop.backend.dto.DailyWellnessResponse;
import HabitLoop.backend.entity.HealthData;
import HabitLoop.backend.entity.MoodLog;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.HealthDataRepository;
import HabitLoop.backend.repository.MoodLogRepository;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class WellnessService {

    private final UserRepository userRepository;
    private final HealthDataRepository healthDataRepository;
    private final MoodLogRepository moodLogRepository;

    public WellnessService(UserRepository userRepository,
                           HealthDataRepository healthDataRepository,
                           MoodLogRepository moodLogRepository) {
        this.userRepository = userRepository;
        this.healthDataRepository = healthDataRepository;
        this.moodLogRepository = moodLogRepository;
    }

    @Transactional
    public DailyWellnessResponse upsertDaily(DailyWellnessRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LocalDate date = request.getDate();

        HealthData health = healthDataRepository.findByUserIdAndRecordDate(user.getId(), date)
                .orElseGet(HealthData::new);
        health.setUser(user);
        health.setRecordDate(date);
        if (request.getSleepHours() != null) {
            health.setSleepHours(request.getSleepHours());
        }
        if (request.getSleepQuality() != null) {
            health.setSleepQuality(request.getSleepQuality());
        }
        if (request.getScreenTimeMinutes() != null) {
            health.setScreenTimeMinutes(request.getScreenTimeMinutes());
        }
        if (request.getStepCount() != null) {
            health.setStepCount(request.getStepCount());
        }
        if (request.getActiveMinutes() != null) {
            health.setActiveMinutes(request.getActiveMinutes());
        }
        if (request.getWaterIntakeMl() != null) {
            health.setWaterIntakeMl(request.getWaterIntakeMl());
        }
        if (request.getNotes() != null) {
            health.setNotes(request.getNotes());
        }
        health = healthDataRepository.save(health);

        MoodLog mood = null;
        if (request.getMoodScore() != null) {
            mood = moodLogRepository.findByUserIdAndLogDate(user.getId(), date)
                    .orElseGet(MoodLog::new);
            mood.setUser(user);
            mood.setLogDate(date);
            mood.setScore(request.getMoodScore());
            if (request.getMoodLabel() != null) {
                mood.setMoodLabel(request.getMoodLabel());
            }
            if (request.getEnergyLevel() != null) {
                mood.setEnergyLevel(request.getEnergyLevel());
            }
            if (request.getStressLevel() != null) {
                mood.setStressLevel(request.getStressLevel());
            }
            if (request.getNotes() != null) {
                mood.setNotes(request.getNotes());
            }
            mood = moodLogRepository.save(mood);
        } else {
            mood = moodLogRepository.findByUserIdAndLogDate(user.getId(), date).orElse(null);
        }

        return toResponse(user.getId(), date, health, mood);
    }

    @Transactional(readOnly = true)
    public List<DailyWellnessResponse> getRange(Long userId, LocalDate startDate, LocalDate endDate) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDate cannot be after endDate");
        }

        List<HealthData> healthRows = healthDataRepository
                .findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(userId, startDate, endDate);
        List<MoodLog> moodRows = moodLogRepository
                .findByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, startDate, endDate);

        Map<LocalDate, HealthData> healthByDate = healthRows.stream()
                .collect(Collectors.toMap(HealthData::getRecordDate, Function.identity(), (a, b) -> a));
        Map<LocalDate, MoodLog> moodByDate = moodRows.stream()
                .collect(Collectors.toMap(MoodLog::getLogDate, Function.identity(), (a, b) -> a));

        List<LocalDate> allDates = new ArrayList<>();
        allDates.addAll(healthByDate.keySet());
        for (LocalDate d : moodByDate.keySet()) {
            if (!allDates.contains(d)) {
                allDates.add(d);
            }
        }
        allDates.sort(LocalDate::compareTo);

        List<DailyWellnessResponse> result = new ArrayList<>();
        for (LocalDate d : allDates) {
            result.add(toResponse(userId, d, healthByDate.get(d), moodByDate.get(d)));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public Optional<DailyWellnessResponse> getOneDay(Long userId, LocalDate date) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        HealthData health = healthDataRepository.findByUserIdAndRecordDate(userId, date).orElse(null);
        MoodLog mood = moodLogRepository.findByUserIdAndLogDate(userId, date).orElse(null);
        if (health == null && mood == null) {
            return Optional.empty();
        }
        return Optional.of(toResponse(userId, date, health, mood));
    }

    private DailyWellnessResponse toResponse(Long userId, LocalDate date, HealthData health, MoodLog mood) {
        DailyWellnessResponse r = new DailyWellnessResponse();
        r.setUserId(userId);
        r.setDate(date);
        if (health != null) {
            r.setHealthDataId(health.getId());
            r.setSleepHours(health.getSleepHours());
            r.setSleepQuality(health.getSleepQuality());
            r.setScreenTimeMinutes(health.getScreenTimeMinutes());
            r.setStepCount(health.getStepCount());
            r.setActiveMinutes(health.getActiveMinutes());
            r.setWaterIntakeMl(health.getWaterIntakeMl());
            r.setNotes(health.getNotes());
        }
        if (mood != null) {
            r.setMoodLogId(mood.getId());
            r.setMoodScore(mood.getScore());
            r.setMoodLabel(mood.getMoodLabel());
            r.setEnergyLevel(mood.getEnergyLevel());
            r.setStressLevel(mood.getStressLevel());
            if (r.getNotes() == null) {
                r.setNotes(mood.getNotes());
            }
        }
        return r;
    }
}
