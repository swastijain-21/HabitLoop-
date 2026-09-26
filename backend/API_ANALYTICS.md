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
  "descriptiveResult": "During the baseline period, the average was 6.16 hours (7 records). During the intervention period, the average was 7.74 hours (7 records). This reflects a measured increase of 1.58 hours (+25.65%)."
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

## 4. Error Handling & Contract Specifications

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
  * Missing required parameters (`userId`, `startDate`, etc.).
  * Malformed date or number formats.
* **404 Not Found:**
  * Specified `userId`, `habitId`, or `experimentId` does not exist in the database.
* **Empty Data Situations:**
  * When a user has 0 records, the API returns **200 OK** with safe default metrics (`null` averages, `0` counts, `INSUFFICIENT_DATA` trend) rather than crashing or throwing 500 errors.
