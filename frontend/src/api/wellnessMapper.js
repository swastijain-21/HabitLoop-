import { OPTION_NUMERIC_MAP } from '../context/UserContext';

/**
 * Map a dashboard weekly log day → backend DailyWellnessRequest fields.
 * Mood/energy UI is 1–5; mood_logs uses 1–10 (multiply by 2).
 */
export function weeklyLogToWellnessPayload(userId, dateStr, log) {
  const sleep = Number(log.sleep ?? 7.5);
  const movementMins = OPTION_NUMERIC_MAP.movement[log.movement] ?? 30;
  const screenHours = OPTION_NUMERIC_MAP.screenTime[log.screenTime] ?? 3.0;
  const moodUi = Number(log.mood ?? 4);
  const energyUi = Number(log.energy ?? 4);

  return {
    userId,
    date: dateStr,
    sleepHours: sleep,
    screenTimeMinutes: Math.round(screenHours * 60),
    activeMinutes: movementMins,
    moodScore: Math.min(10, Math.max(1, moodUi * 2)),
    energyLevel: Math.min(10, Math.max(1, energyUi * 2)),
    moodLabel: moodUi >= 4 ? 'Positive' : moodUi >= 3 ? 'Okay' : 'Low',
  };
}

/**
 * Map a backend DailyWellnessResponse → partial weekly log fields for the UI.
 */
export function wellnessResponseToWeeklyLog(day) {
  if (!day) return null;

  const sleep = day.sleepHours != null ? Number(day.sleepHours) : null;
  const moodScore10 = day.moodScore != null ? Number(day.moodScore) : null;
  const energy10 = day.energyLevel != null ? Number(day.energyLevel) : null;
  const screenMins = day.screenTimeMinutes != null ? Number(day.screenTimeMinutes) : null;
  const activeMins = day.activeMinutes != null ? Number(day.activeMinutes) : null;

  const screenHours = screenMins != null ? screenMins / 60 : null;

  const pickClosest = (value, map) => {
    if (value == null) return null;
    let bestKey = null;
    let bestDiff = Infinity;
    Object.entries(map).forEach(([key, num]) => {
      const diff = Math.abs(num - value);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestKey = key;
      }
    });
    return bestKey;
  };

  return {
    dateStr: day.date,
    timestamp: `${day.date}T00:00:00.000Z`,
    saved: true,
    partiallyTracked: true,
    ...(sleep != null ? { sleep } : {}),
    ...(activeMins != null ? { movement: pickClosest(activeMins, OPTION_NUMERIC_MAP.movement) } : {}),
    ...(screenHours != null ? { screenTime: pickClosest(screenHours, OPTION_NUMERIC_MAP.screenTime) } : {}),
    ...(energy10 != null ? { energy: Math.round(energy10 / 2) } : {}),
    ...(moodScore10 != null ? { mood: Math.round(moodScore10 / 2) } : {}),
    metrics: {
      sleep_hours: sleep,
      movement_minutes: activeMins,
      screen_time_hours: screenHours,
      energy_score: energy10 != null ? Math.round(energy10 / 2) : null,
      mood_score: moodScore10 != null ? Math.round(moodScore10 / 2) : null,
    },
  };
}
