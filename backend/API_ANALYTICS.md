# HabitLoop Analytics REST API Documentation 📡

This document details the Analytics REST APIs built during **Phase 3** (Person 3: Database + Analytics).
These endpoints expose descriptive statistics and pre/post intervention metrics for consumption by:
* **Person 1 (Frontend):** React dashboard cards, habit completion trackers, and trend charts.
* **Person 4 (Gemini AI):** Structured analytics payloads for generating personalized lifestyle insights.

**Base URL:** `/api/analytics`  
**CORS Policy:** `@CrossOrigin(origins = "*")` enabled for local Vite development (`http://localhost:5173`).

---

## 1. Habit Analytics

### 1.1 User Habit Summary
* **Method:** `GET`
* **Path:** `/api/analytics/habits/user/{userId}`
* **Parameters:**
  * `userId` (Path variable, `Long`, required): ID of the user.
  * `referenceDate` (Query param, `LocalDate` [YYYY-MM-DD], optional): Target date for daily completion snapshot. Defaults to current date if omitted.
* **Purpose:** Returns comprehensive habit statistics, today's completion rates, 7-day daily completion history, and overall trajectory.
* **Response DTO:** `HabitSummaryDTO`
* **Example Request:**  
  `GET /api/analytics/habits/user/1?referenceDate=2026-09-23`
* **Example Response (200 OK):**
```json
{
  "userId": 1,
  "totalHabits": 4,
  "activeHabits": 4,
  "inactiveHabits": 0,
  "completedToday": 3,
  "incompleteToday": 1,
  "completionPercentageToday": 75.0,
  "weeklyCompletionPercentage": 82.14,
  "overallTrend": "IMPROVING",
  "recentDailyCompletions": [
    {
      "date": "2026-09-17",
      "totalScheduled": 4,
      "completedCount": 3,
      "incompleteCount": 1,
      "completionPercentage": 75.0
    }
  ],
  "habits": [
    {
      "habitId": 1,
      "habitName": "Morning Meditation",
      "category": "MINDFULNESS",
      "targetValue": 10.0,
      "unit": "minutes",
      "totalLogs": 14,
      "completedLogs": 13,
      "incompleteLogs": 1,
      "completionRatePercentage": 92.86,
      "currentStreak": 11,
      "longestStreak": 11,
      "trend": "IMPROVING"
    }
  ]
}
```
* **Error Cases:**
  * `404 Not Found`: User does not exist (`{"status": 404, "error": "Not Found", "message": "User with id 999 does not exist."}`).

---

### 1.2 Individual Habit Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/habits/{habitId}`
* **Parameters:**
  * `habitId` (Path variable, `Long`, required): ID of the habit.
* **Purpose:** Returns granular analytics for a single habit including historical logs, streaks, and trend.
* **Response DTO:** `HabitAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/habits/1`
* **Example Response (200 OK):**
```json
{
  "habitId": 1,
  "habitName": "Morning Meditation",
  "category": "MINDFULNESS",
  "targetValue": 10.0,
  "unit": "minutes",
  "totalLogs": 14,
  "completedLogs": 13,
  "incompleteLogs": 1,
  "completionRatePercentage": 92.86,
  "currentStreak": 11,
  "longestStreak": 11,
  "trend": "IMPROVING"
}
```
* **Error Cases:**
  * `404 Not Found`: Habit does not exist.

---

## 2. Health & Wellness Analytics

All health endpoints accept date-range filtering via `startDate` and `endDate` query parameters (`YYYY-MM-DD`).

### 2.1 Health Overview (Combined Metrics)
* **Method:** `GET`
* **Path:** `/api/analytics/health/overview`
* **Parameters:**
  * `userId` (Query param, `Long`, required)
  * `startDate` (Query param, `LocalDate`, required)
  * `endDate` (Query param, `LocalDate`, required)
* **Purpose:** Single payload aggregating sleep, mood, screen time, and activity statistics for dashboard rendering.
* **Response DTO:** `HealthOverviewDTO`
* **Example Request:**  
  `GET /api/analytics/health/overview?userId=1&startDate=2026-09-10&endDate=2026-09-16`

---

### 2.2 Sleep Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/health/sleep`
* **Parameters:** `userId`, `startDate`, `endDate`
* **Response DTO:** `SleepAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/health/sleep?userId=1&startDate=2026-09-10&endDate=2026-09-16`
* **Example Response (200 OK):**
```json
{
  "averageSleepHours": 6.16,
  "minSleepHours": 5.5,
  "maxSleepHours": 7.0,
  "averageSleepQuality": 5.29,
  "totalRecords": 7,
  "trend": "IMPROVING",
  "periodComparison": {
    "metricName": "Sleep Duration",
    "unit": "hours",
    "beforeAverage": 6.0,
    "afterAverage": 6.43,
    "absoluteChange": 0.43,
    "percentageChange": 7.17,
    "direction": "INCREASE",
    "descriptiveSummary": "Average Sleep Duration changed from 6.00 to 6.43 hours (change: +0.43 hours, +7.17%)."
  }
}
```

---

### 2.3 Mood Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/health/mood`
* **Parameters:** `userId`, `startDate`, `endDate`
* **Response DTO:** `MoodAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/health/mood?userId=1&startDate=2026-09-10&endDate=2026-09-16`
* **Example Response (200 OK):**
```json
{
  "averageScore": 6.0,
  "minScore": 5,
  "maxScore": 7,
  "averageEnergyLevel": 4.86,
  "averageStressLevel": 6.86,
  "dominantMood": "Tired",
  "totalRecords": 7,
  "trend": "STABLE",
  "periodComparison": null
}
```

---

### 2.4 Screen-Time Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/health/screentime`
* **Parameters:** `userId`, `startDate`, `endDate`
* **Response DTO:** `ScreenTimeAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/health/screentime?userId=1&startDate=2026-09-10&endDate=2026-09-16`
* **Example Response (200 OK):**
```json
{
  "averageScreenTimeMinutes": 385.71,
  "totalScreenTimeHours": 45.0,
  "minMinutes": 310,
  "maxMinutes": 430,
  "totalRecords": 7,
  "trend": "DECLINING",
  "periodComparison": null
}
```

---

### 2.5 Activity Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/health/activity`
* **Parameters:** `userId`, `startDate`, `endDate`
* **Response DTO:** `ActivityAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/health/activity?userId=2&startDate=2026-09-17&endDate=2026-09-23`
* **Example Response (200 OK):**
```json
{
  "averageStepCount": 10842.86,
  "totalStepCount": 75900,
  "minStepCount": 6000,
  "maxStepCount": 13500,
  "averageActiveMinutes": 50.71,
  "totalActiveMinutes": 355,
  "averageWaterIntakeMl": 2742.86,
  "totalRecords": 7,
  "trend": "STABLE",
  "periodComparison": null
}
```

---

## 3. Experiment Analytics

### 3.1 Single Experiment Evaluation
* **Method:** `GET`
* **Path:** `/api/analytics/experiments/{experimentId}`
* **Parameters:**
  * `experimentId` (Path variable, `Long`, required)
* **Purpose:** Evaluates baseline vs. intervention periods for a self-experiment with descriptive changes.
* **Response DTO:** `ExperimentAnalyticsDTO`
* **Example Request:**  
  `GET /api/analytics/experiments/1`
* **Example Response (200 OK):**
```json
{
  "experimentId": 1,
  "userId": 1,
  "title": "Digital Sunset: No Phone After 9 PM",
  "hypothesis": "Cutting off screen time after 9:00 PM will increase average nightly sleep duration by at least 1 hour and improve morning energy.",
  "targetMetric": "SLEEP_HOURS",
  "unit": "hours",
  "status": "ACTIVE",
  "beforeStartDate": "2026-09-10",
  "beforeEndDate": "2026-09-16",
  "duringStartDate": "2026-09-17",
  "duringEndDate": "2026-09-23",
  "beforeAverage": 6.16,
  "duringAverage": 7.74,
  "absoluteChange": 1.58,
  "percentageChange": 25.65,
  "beforeCount": 7,
  "duringCount": 7,
  "hasSufficientData": true,
  "direction": "INCREASE",
  "descriptiveResult": "During the baseline period, the average was 6.16 hours (7 records). During the intervention period, the average was 7.74 hours (7 records). This reflects a measured increase of 1.58 hours (+25.65%).",
  "metrics": {
    "sleep": {
      "currentAverage": 7.74,
      "previousAverage": 6.16,
      "change": 1.58,
      "percentageChange": 25.65,
      "unit": "hours",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "mood": {
      "currentAverage": 7.5,
      "previousAverage": 6.0,
      "change": 1.5,
      "percentageChange": 25.0,
      "unit": "points (1-10)",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "screenTime": {
      "currentAverage": 280.0,
      "previousAverage": 385.71,
      "change": -105.71,
      "percentageChange": -27.41,
      "unit": "minutes",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "steps": {
      "currentAverage": 10842.86,
      "previousAverage": 9200.0,
      "change": 1642.86,
      "percentageChange": 17.86,
      "unit": "steps",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "activeMinutes": {
      "currentAverage": 50.71,
      "previousAverage": 35.0,
      "change": 15.71,
      "percentageChange": 44.89,
      "unit": "minutes",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "waterIntake": {
      "currentAverage": 2742.86,
      "previousAverage": 2100.0,
      "change": 642.86,
      "percentageChange": 30.61,
      "unit": "ml",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "habitCompletion": {
      "currentAverage": 85.71,
      "previousAverage": 71.43,
      "change": 14.28,
      "percentageChange": 19.99,
      "unit": "%",
      "currentRecords": 7,
      "previousRecords": 7
    }
  }
}
```

### 3.2 User Experiments List
* **Method:** `GET`
* **Path:** `/api/analytics/experiments/user/{userId}`
* **Parameters:** `userId` (Path variable, `Long`, required)
* **Response DTO:** `List<ExperimentAnalyticsDTO>`
* **Example Request:**  
  `GET /api/analytics/experiments/user/1`

---

## 4. Cross-Domain Analytics Summary (Gemini-Ready Data Layer) 🤖

### 4.1 Unified User Analytics Summary
* **Method:** `GET`
* **Path:** `/api/analytics/summary/{userId}`
* **Parameters:**
  * `userId` (Path variable, `Long`, required): ID of the user.
  * `startDate` (Query param, `LocalDate` [YYYY-MM-DD], optional): Start date of the current evaluation window. Defaults to `endDate - 6 days` (7-day window) if omitted.
  * `endDate` (Query param, `LocalDate` [YYYY-MM-DD], optional): End date of the current evaluation window. Defaults to today (`LocalDate.now()`) if omitted.
  * `previousStartDate` (Query param, `LocalDate` [YYYY-MM-DD], optional): Explicit start date for comparison baseline period. If omitted, defaults to the period of equal duration directly preceding `startDate`.
  * `previousEndDate` (Query param, `LocalDate` [YYYY-MM-DD], optional): Explicit end date for comparison baseline period. If omitted, defaults to `startDate - 1 day`.
* **Purpose:** Single consolidated, machine-readable analytical summary combining habits, sleep, mood, screen time, physical activity, and experiments with explicit period-over-period comparisons. Suitable for direct ingestion by Person 1 (dashboard views) and Person 4 (Gemini AI prompt synthesis).
* **Response DTO:** `CrossDomainAnalyticsSummaryDTO`
* **Example Request:**  
  `GET /api/analytics/summary/1?startDate=2026-09-17&endDate=2026-09-23`
* **Example Response (200 OK):**
```json
{
  "userId": 1,
  "currentPeriod": {
    "startDate": "2026-09-17",
    "endDate": "2026-09-23"
  },
  "previousPeriod": {
    "startDate": "2026-09-10",
    "endDate": "2026-09-16"
  },
  "habits": {
    "totalHabits": 4,
    "activeHabits": 4,
    "completionPercentage": 82.14,
    "currentStreak": 11,
    "longestStreak": 11,
    "recentCompletionTrend": "IMPROVING"
  },
  "sleep": {
    "currentAverage": 7.1,
    "previousAverage": 5.8,
    "change": 1.3,
    "percentageChange": 22.41,
    "unit": "hours",
    "currentRecords": 7,
    "previousRecords": 7,
    "quality": {
      "currentAverage": 6.8,
      "previousAverage": 5.2,
      "change": 1.6,
      "percentageChange": 30.77,
      "unit": "points (1-10)",
      "currentRecords": 7,
      "previousRecords": 7
    }
  },
  "mood": {
    "currentAverage": 7.0,
    "previousAverage": 6.0,
    "change": 1.0,
    "percentageChange": 16.67,
    "unit": "points (1-10)",
    "currentRecords": 7,
    "previousRecords": 7,
    "dominantMood": "Energized",
    "energyLevel": {
      "currentAverage": 6.5,
      "previousAverage": 4.86,
      "change": 1.64,
      "percentageChange": 33.74,
      "unit": "points (1-10)",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "stressLevel": {
      "currentAverage": 4.1,
      "previousAverage": 6.86,
      "change": -2.76,
      "percentageChange": -40.23,
      "unit": "points (1-10)",
      "currentRecords": 7,
      "previousRecords": 7
    }
  },
  "screenTime": {
    "currentAverage": 280.0,
    "previousAverage": 385.71,
    "change": -105.71,
    "percentageChange": -27.41,
    "unit": "minutes",
    "currentRecords": 7,
    "previousRecords": 7
  },
  "activity": {
    "steps": {
      "currentAverage": 10842.86,
      "previousAverage": 9200.0,
      "change": 1642.86,
      "percentageChange": 17.86,
      "unit": "steps",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "activeMinutes": {
      "currentAverage": 50.71,
      "previousAverage": 35.0,
      "change": 15.71,
      "percentageChange": 44.89,
      "unit": "minutes",
      "currentRecords": 7,
      "previousRecords": 7
    },
    "waterIntake": {
      "currentAverage": 2742.86,
      "previousAverage": 2100.0,
      "change": 642.86,
      "percentageChange": 30.61,
      "unit": "ml",
      "currentRecords": 7,
      "previousRecords": 7
    }
  },
  "experiments": [
    {
      "experimentId": 1,
      "userId": 1,
      "title": "Digital Sunset: No Phone After 9 PM",
      "targetMetric": "SLEEP_HOURS",
      "status": "ACTIVE"
    }
  ]
}
```
* **Empty Data Situations:**
  * When a user has 0 records during the requested periods, the API returns **200 OK** with safe default representations:
    * `currentAverage`: `null`
    * `previousAverage`: `null`
    * `change`: `null`
    * `percentageChange`: `null`
    * `currentRecords`: `0`
    * `previousRecords`: `0`
    * `habits.completionPercentage`: `0.0`, `currentStreak`: `0`, `longestStreak`: `0`, `recentCompletionTrend`: `"INSUFFICIENT_DATA"`.
  * Zero-baseline rule: When baseline is `0.0` and current is `> 0.0`, `percentageChange` returns `null` to prevent division by zero or inflated infinite percentages. When both baseline and current are `0.0`, `percentageChange` returns `0.0`.
* **Important Contract Limitations:**
  * **Measurements only:** This layer strictly delivers verified mathematical measurements (changes, percentages, averages). It intentionally does NOT infer causal links (e.g., does not claim that screen time reduction caused sleep improvements). All interpretation, causality, and recommendations are reserved for Person 4's Gemini integration.

---

## 5. Error Handling & Contract Specifications

Errors return a standard JSON object with appropriate HTTP status codes:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "startDate (2026-09-20) cannot be after endDate (2026-09-10).",
  "timestamp": "2026-09-27T02:00:00"
}
```

* **400 Bad Request:**
  * `startDate` is chronologically after `endDate`.
  * `previousStartDate` is chronologically after `previousEndDate`.
  * Missing required parameters (`userId`, etc.).
  * Malformed date or number formats.
* **404 Not Found:**
  * Specified `userId`, `habitId`, or `experimentId` does not exist in the database.
* **Empty Data Situations:**
  * When a user has 0 records, the API returns **200 OK** with safe default metrics (`null` averages, `0` counts, `INSUFFICIENT_DATA` trend) rather than crashing or throwing 500 errors.

