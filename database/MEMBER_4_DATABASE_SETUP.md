# HabitLoop Database Setup Guide for Member 4 (AI + Integration + Testing) 🚀

This guide explains how to set up an **independent, self-contained copy of the HabitLoop MySQL database** on your own computer.

> [!IMPORTANT]
> **Isolated Local Architecture:** You must run your own local MySQL server. You must **NOT** connect directly to teammate MySQL instances or expose MySQL port `3306` to external/public networks. All database access happens entirely within `localhost` on your machine.

---

## 🏛️ Local Architecture Overview

```text
+-----------------------------------------------------------+
|                   MEMBER 4'S COMPUTER                     |
|                                                           |
|   +-----------------------+     +---------------------+   |
|   |  Frontend / React UI  | <-> | Spring Boot Backend |   |
|   |  (Vite port 5173)     |     | (port 8080)         |   |
|   +-----------------------+     +----------+----------+   |
|                                            |              |
|                                   JDBC Local Connection   |
|                                            v              |
|                                 +---------------------+   |
|                                 |  Local MySQL Server |   |
|                                 |  (localhost:3306)   |   |
|                                 +----------+----------+   |
|                                            |              |
|                                            v              |
|                                 +---------------------+   |
|                                 | `habitloop` Database|   |
|                                 | (Imported Dump)     |   |
|                                 +---------------------+   |
+-----------------------------------------------------------+
```

---

## 🛠️ Prerequisites

Before proceeding, ensure you have the following installed on your machine:

1. **MySQL Server 8.0+** (or MariaDB 10.5+) running locally on default port `3306`.
2. **MySQL Client Tools**:
   * Command Line: `mysql` CLI client, **OR**
   * GUI: **MySQL Workbench**, **DBeaver**, or **DataGrip**.
3. **Backend Environment** (for running HabitLoop):
   * Java Development Kit (**JDK 21** or later)
   * Git

---

## Step 1 — Obtain the SQL Dump File

The entire database schema, constraints, indexes, and rich 14-day test dataset are bundled into a single file in the repository:

```text
database/habitloop_shared.sql
```

This file is self-contained. It handles database creation (`habitloop`), drops any existing tables cleanly, defines all tables with proper types, checks, and foreign keys, and seeds all baseline data.

---

## Step 2 — Import Database into Your Local MySQL

Choose either the **Command Line (CLI)** method or the **MySQL Workbench** method below.

### Option A: MySQL Command Line (CLI) — Recommended

Open your terminal (PowerShell, Bash, or Command Prompt) and run:

```bash
# Navigate to the repository root directory
cd HabitLoop-

# Import the self-contained dump into your local MySQL
mysql -u YOUR_LOCAL_USERNAME -p < database/habitloop_shared.sql
```

*Replace `YOUR_LOCAL_USERNAME` with your local MySQL username (typically `root`). You will be prompted to enter your local MySQL password securely in your terminal.*

> **PowerShell note:** If using Windows PowerShell and the `<` redirection operator is restricted, run:
> ```powershell
> Get-Content database\habitloop_shared.sql | mysql -u YOUR_LOCAL_USERNAME -p
> ```

---

### Option B: MySQL Workbench GUI

1. Open **MySQL Workbench** and connect to your local MySQL instance (`localhost:3306`).
2. Go to the menu: **File** -> **Open SQL Script...**
3. Select `database/habitloop_shared.sql` from your `HabitLoop-` project folder.
4. Click the **Execute (Lightning Bolt ⚡)** button to run the entire script.
5. In the Navigator pane on the left, right-click and select **Refresh All**. You will now see the `habitloop` database with all tables and data populated.

---

## Step 3 — Verify the Import

Run the following SQL queries in your MySQL client to verify the installation:

```sql
USE habitloop;

-- 1. Check all tables exist (8 total: 6 core analytics tables + 2 integration tables)
SHOW TABLES;

-- 2. Verify record counts match the baseline dataset
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'habits', COUNT(*) FROM habits
UNION ALL
SELECT 'habit_logs', COUNT(*) FROM habit_logs
UNION ALL
SELECT 'mood_logs', COUNT(*) FROM mood_logs
UNION ALL
SELECT 'health_data', COUNT(*) FROM health_data
UNION ALL
SELECT 'experiments', COUNT(*) FROM experiments
UNION ALL
SELECT 'habit_completions', COUNT(*) FROM habit_completions
UNION ALL
SELECT 'mood_entries', COUNT(*) FROM mood_entries;
```

### Expected Row Counts:

| Table Name | Expected Rows | Description |
| :--- | :--- | :--- |
| `users` | **3** | Alex Chen (`alex_dev`), Sneha Patel (`sneha_runner`), Jordan Taylor (`jordan_new`) |
| `habits` | **7** | Meditation, Reading, Water, Digital Sunset, 5km Run, Sugar Curfew, Evening Walk |
| `habit_logs` | **49** | Complete 14-day history for Alex & Sneha with completion flags and logged values |
| `mood_logs` | **21** | 14-day mood entries for Alex, 7-day for Sneha (scores 1–10, energy, stress, notes) |
| `health_data` | **21** | Sleep hours/quality, screen time minutes, steps, active minutes, water intake |
| `experiments` | **2** | Personal lifestyle interventions with baseline vs. intervention time windows |
| `habit_completions` | **12** | Backend compatibility completions |
| `mood_entries` | **6** | Backend compatibility mood entries |

---

## Step 4 — Configure Spring Boot Backend Connection

To connect your local Spring Boot backend to your newly imported database:

### 1. Update Database Credentials

Open `backend/src/main/resources/application.properties` or set environment variables:

```properties
# MySQL Datasource Configuration (Local)
spring.datasource.url=jdbc:mysql://localhost:3306/habitloop?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_LOCAL_USERNAME
spring.datasource.password=YOUR_LOCAL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

> [!NOTE]
> Alternatively, you can pass environment variables without modifying files:
> ```bash
> export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/habitloop?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
> export SPRING_DATASOURCE_USERNAME="YOUR_LOCAL_USERNAME"
> export SPRING_DATASOURCE_PASSWORD="YOUR_LOCAL_PASSWORD"
> ```

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows: `.\mvnw.cmd spring-boot:run`)*

The backend will boot up on `http://localhost:8080`.

---

## 📊 Step 5 — Understand & Reuse the Existing Data Model

> [!WARNING]
> **Do NOT invent duplicate tables or redesign the schema!**
> The database schema has been standardized for the entire HabitLoop platform. For your AI integration, persona generation, and prompt context, **reuse the existing tables**.

The HabitLoop relational data model is organized into the following core entities:

### 1. `users`
* Primary accounts. User ID `1` (`alex_dev`) has the richest 14-day tracking history and is the primary subject for experiment and streak testing.

### 2. `habits`
* Definitions of habits owned by users (`category`, `frequency`, `target_value`, `unit`, `is_active`).

### 3. `habit_logs`
* Daily habit completion tracking.
* Unique constraint on `(habit_id, log_date)` prevents duplicate records.
* Contains `completed` (boolean), `logged_value` (numeric amount), and optional `notes`.

### 4. `mood_logs`
* Daily subjective emotional wellbeing.
* Unique constraint on `(user_id, log_date)`.
* Fields: `score` (1–10), `mood_label` (e.g., 'Refreshed', 'Stressed', 'Productive'), `energy_level` (1–10), `stress_level` (1–10), `notes`.

### 5. `health_data`
* Daily physical biometric and lifestyle metrics.
* Unique constraint on `(user_id, record_date)`.
* Fields:
  * `sleep_hours` (e.g., `7.50` hrs)
  * `sleep_quality` (1–10)
  * `screen_time_minutes` (e.g., `185` mins)
  * `step_count` (e.g., `8200` steps)
  * `active_minutes` (e.g., `45` mins)
  * `water_intake_ml` (e.g., `2200` ml)

### 6. `experiments`
* Lifestyle interventions with baseline vs. intervention time windows.
* Fields: `title`, `hypothesis`, `target_metric`, `habit_id`, `status` (`ACTIVE`, `COMPLETED`), `before_start_date`, `before_end_date`, `during_start_date`, `during_end_date`.
* Example: Alex's *Digital Sunset* experiment (Habit 4) testing whether putting away screens after 9:00 PM increases sleep hours.

---

## 🧠 Step 6 — Utilizing the Analytics Engine for AI Integration

The **Database + Analytics** module (Person 3) has already implemented an extensive descriptive statistics and pre/post intervention comparison engine.

**You do NOT need to calculate statistical metrics, streaks, or intervention percentage changes manually in your AI code.** You can directly call these tested REST APIs to fetch structured JSON payloads:

| Endpoint | Description | Useful AI Prompt Input |
| :--- | :--- | :--- |
| `GET /api/analytics/habits/user/{userId}` | Comprehensive habit summary, today's completion %, 7-day daily completion history, and streak trends. | Weekly habit habituation analysis |
| `GET /api/analytics/habits/{habitId}` | Granular statistics, total completions, and current/longest streak for a specific habit. | Habit coaching & reinforcement prompts |
| `GET /api/analytics/health/sleep?userId={id}` | Average sleep hours, sleep quality, consistency score, and daily sleep logs. | Sleep coaching & bedtime routine advice |
| `GET /api/analytics/health/screentime?userId={id}` | Average screen time minutes, peak screen day, and time-series log. | Digital detox recommendations |
| `GET /api/analytics/health/mood?userId={id}` | Average mood score, dominant mood label, energy/stress correlations. | Mental wellness & stress reduction prompts |
| `GET /api/analytics/health/activity?userId={id}` | Average daily steps, total active minutes, active day count. | Fitness habit coaching |
| `GET /api/analytics/health/overview?userId={id}` | Combined multi-domain summary of sleep, mood, screentime, and activity. | **Comprehensive daily/weekly AI wellness briefing** |
| `GET /api/analytics/experiments/{expId}` | Baseline vs. during comparison (`beforeAverage`, `duringAverage`, `percentageChange`, `improvement`). | **A/B Experiment outcome synthesis and conclusions** |
| `GET /api/analytics/summary/{userId}` | Cross-domain analytics combining all wellness pillars and overall progress score. | High-level user profile & Gemini insights |

All endpoints support query parameter `referenceDate=YYYY-MM-DD` (e.g., `2026-09-23`) to evaluate historical snapshots.

---

## 🔒 Security Best Practices for Member 4

1. **Keep Credentials Local**: Never commit passwords, `.env` files, or local machine configurations to Git.
2. **No Port Exposure**: Do not open port `3306` to external interfaces; keep MySQL bound strictly to `127.0.0.1` / `localhost`.
3. **Reproducibility**: If you ever need to reset your local database to a clean state, simply re-execute `habitloop_shared.sql`.
