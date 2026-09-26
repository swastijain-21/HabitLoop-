-- ==============================================================================
-- HabitLoop Sample Development & Test Seed Data
-- Database: MySQL 8.0+
-- Role: Person 3 (Database + Analytics)
-- ==============================================================================

USE habitloop;

-- ------------------------------------------------------------------------------
-- 1. Insert Users
-- ------------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, first_name, last_name) VALUES
(1, 'alex_dev', 'alex@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Alex', 'Chen'),
(2, 'sneha_runner', 'sneha@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Sneha', 'Patel'),
(3, 'jordan_new', 'jordan@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Jordan', 'Taylor')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ------------------------------------------------------------------------------
-- 2. Insert Habits
-- ------------------------------------------------------------------------------
INSERT INTO habits (id, user_id, name, description, category, frequency, target_value, unit, is_active) VALUES
-- Alex's habits
(1, 1, 'Morning Meditation', '10-minute mindfulness breathing session', 'MINDFULNESS', 'DAILY', 10.00, 'minutes', TRUE),
(2, 1, 'Read 20 Pages', 'Read non-fiction or career book daily', 'PRODUCTIVITY', 'DAILY', 20.00, 'pages', TRUE),
(3, 1, 'Drink 2L Water', 'Stay hydrated throughout the day', 'HEALTH', 'DAILY', 2000.00, 'ml', TRUE),
(4, 1, 'Digital Sunset Curfew', 'Put away screens and phone by 9:00 PM', 'LIFESTYLE', 'DAILY', 1.00, 'times', TRUE),

-- Sneha's habits
(5, 2, 'Morning 5km Run', 'Outdoor jogging or treadmill run', 'FITNESS', 'DAILY', 5.00, 'km', TRUE),
(6, 2, 'No Refined Sugar', 'Avoid sugary snacks and sodas', 'HEALTH', 'DAILY', 1.00, 'times', TRUE),

-- Jordan's habit (single habit for edge case testing)
(7, 3, 'Evening Walk', 'Gentle 15-minute neighborhood walk', 'FITNESS', 'DAILY', 15.00, 'minutes', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ------------------------------------------------------------------------------
-- 3. Insert Habit Logs (14-day history for Alex & Sneha)
-- ------------------------------------------------------------------------------
INSERT INTO habit_logs (habit_id, user_id, log_date, completed, logged_value, notes) VALUES
-- Alex: Meditation (Habit 1)
(1, 1, '2026-09-10', TRUE, 10.00, 'Felt calm'),
(1, 1, '2026-09-11', TRUE, 10.00, 'Morning session'),
(1, 1, '2026-09-12', FALSE, 0.00, 'Overslept'),
(1, 1, '2026-09-13', TRUE, 10.00, 'Focused breathing'),
(1, 1, '2026-09-14', TRUE, 12.00, 'Extra 2 mins'),
(1, 1, '2026-09-15', TRUE, 10.00, 'Good session'),
(1, 1, '2026-09-16', TRUE, 10.00, 'Mid-day reset'),
(1, 1, '2026-09-17', TRUE, 10.00, 'Consistent'),
(1, 1, '2026-09-18', TRUE, 10.00, 'Nice and quiet'),
(1, 1, '2026-09-19', TRUE, 15.00, 'Weekend extended meditation'),
(1, 1, '2026-09-20', TRUE, 10.00, 'Ready for the week'),
(1, 1, '2026-09-21', TRUE, 10.00, 'Refreshed'),
(1, 1, '2026-09-22', TRUE, 10.00, 'On track'),
(1, 1, '2026-09-23', TRUE, 10.00, 'Solid routine'),

-- Alex: Read 20 Pages (Habit 2)
(2, 1, '2026-09-10', TRUE, 22.00, 'Finished chapter 3'),
(2, 1, '2026-09-11', TRUE, 20.00, 'Great insights'),
(2, 1, '2026-09-12', TRUE, 25.00, 'Could not put it down'),
(2, 1, '2026-09-13', FALSE, 10.00, 'Tired, read only 10 pages'),
(2, 1, '2026-09-14', TRUE, 20.00, 'On target'),
(2, 1, '2026-09-15', TRUE, 20.00, 'Good progress'),
(2, 1, '2026-09-16', FALSE, 0.00, 'Busy with assignments'),
(2, 1, '2026-09-17', TRUE, 25.00, 'Back on track'),
(2, 1, '2026-09-18', TRUE, 20.00, 'Chapter 7'),
(2, 1, '2026-09-19', TRUE, 30.00, 'Weekend reading marathon'),
(2, 1, '2026-09-20', TRUE, 20.00, 'Consistent'),
(2, 1, '2026-09-21', TRUE, 20.00, 'Productive day'),
(2, 1, '2026-09-22', TRUE, 22.00, 'Almost done with book'),
(2, 1, '2026-09-23', TRUE, 20.00, 'Target reached'),

-- Alex: Digital Sunset Curfew (Habit 4 - Linked to Experiment 1)
-- Notice: Before period (Sept 10-16) missed often; During period (Sept 17-23) consistently completed
(4, 1, '2026-09-10', FALSE, 0.00, 'Browsed YouTube until midnight'),
(4, 1, '2026-09-11', FALSE, 0.00, 'Late night discord chat'),
(4, 1, '2026-09-12', TRUE, 1.00, 'Put phone away at 9'),
(4, 1, '2026-09-13', FALSE, 0.00, 'Late work email'),
(4, 1, '2026-09-14', FALSE, 0.00, 'Watched video'),
(4, 1, '2026-09-15', TRUE, 1.00, 'Stopped early'),
(4, 1, '2026-09-16', FALSE, 0.00, 'Late screen usage'),
(4, 1, '2026-09-17', TRUE, 1.00, 'Experiment day 1: Screen off at 9'),
(4, 1, '2026-09-18', TRUE, 1.00, 'Experiment day 2: Phone charging in desk'),
(4, 1, '2026-09-19', TRUE, 1.00, 'Experiment day 3: Read paperback instead'),
(4, 1, '2026-09-20', TRUE, 1.00, 'Experiment day 4: Screen off at 9'),
(4, 1, '2026-09-21', TRUE, 1.00, 'Experiment day 5: Very peaceful sleep'),
(4, 1, '2026-09-22', TRUE, 1.00, 'Experiment day 6: Solid adherence'),
(4, 1, '2026-09-23', TRUE, 1.00, 'Experiment day 7: Completed full week!'),

-- Sneha: 5km Run (Habit 5)
(5, 2, '2026-09-17', TRUE, 5.20, 'Felt energized'),
(5, 2, '2026-09-18', TRUE, 5.00, 'Morning pace 5:30/km'),
(5, 2, '2026-09-19', TRUE, 6.00, 'Long run Saturday'),
(5, 2, '2026-09-20', FALSE, 0.00, 'Rest day'),
(5, 2, '2026-09-21', TRUE, 5.10, 'Back on track'),
(5, 2, '2026-09-22', TRUE, 5.00, 'Cool weather run'),
(5, 2, '2026-09-23', TRUE, 5.30, 'Great finish')
ON DUPLICATE KEY UPDATE completed=VALUES(completed), logged_value=VALUES(logged_value);

-- ------------------------------------------------------------------------------
-- 4. Insert Mood Logs (14-day history for Alex, 7 days for Sneha)
-- ------------------------------------------------------------------------------
INSERT INTO mood_logs (user_id, log_date, score, mood_label, energy_level, stress_level, notes) VALUES
-- Alex: Baseline period (Sept 10 - Sept 16)
(1, '2026-09-10', 6, 'Tired', 5, 7, 'Sluggish morning, stayed up late'),
(1, '2026-09-11', 5, 'Stressed', 4, 8, 'Felt tired all day from lack of sleep'),
(1, '2026-09-12', 7, 'Neutral', 6, 6, 'Decent day, got some work done'),
(1, '2026-09-13', 6, 'Tired', 4, 7, 'Hard to focus in the afternoon'),
(1, '2026-09-14', 5, 'Anxious', 4, 8, 'Deadlines piling up'),
(1, '2026-09-15', 7, 'Calm', 6, 5, 'Relaxed evening'),
(1, '2026-09-16', 6, 'Neutral', 5, 7, 'Ready to start sleep experiment'),

-- Alex: Intervention period (Sept 17 - Sept 23)
(1, '2026-09-17', 8, 'Refreshed', 7, 4, 'Woke up easily, no phone before bed helped'),
(1, '2026-09-18', 8, 'Productive', 8, 4, 'High morning energy, great focus'),
(1, '2026-09-19', 9, 'Happy', 8, 3, 'Wonderful Saturday, felt well-rested'),
(1, '2026-09-20', 8, 'Calm', 7, 4, 'Ready for Sunday prep without screen stress'),
(1, '2026-09-21', 8, 'Energetic', 8, 5, 'Monday felt surprisingly easy'),
(1, '2026-09-22', 9, 'Productive', 9, 3, 'Flow state throughout the afternoon'),
(1, '2026-09-23', 9, 'Great', 9, 3, 'End of week 1 experiment: massive mood boost'),

-- Sneha: Recent days
(2, '2026-09-17', 8, 'Energetic', 8, 4, 'Post-run high'),
(2, '2026-09-18', 8, 'Great', 8, 3, 'Clear focus today'),
(2, '2026-09-19', 9, 'Joyful', 9, 2, 'Weekend trail running'),
(2, '2026-09-20', 7, 'Calm', 6, 3, 'Restful Sunday'),
(2, '2026-09-21', 8, 'Motivated', 8, 4, 'Strong start to the week'),
(2, '2026-09-22', 8, 'Energetic', 8, 3, 'Good recovery'),
(2, '2026-09-23', 9, 'Accomplished', 9, 2, 'Finished 5k PR')
ON DUPLICATE KEY UPDATE score=VALUES(score), mood_label=VALUES(mood_label);

-- ------------------------------------------------------------------------------
-- 5. Insert Health Data (Sleep, Screen Time, Steps, Activity)
-- ------------------------------------------------------------------------------
INSERT INTO health_data (user_id, record_date, sleep_hours, sleep_quality, screen_time_minutes, step_count, active_minutes, water_intake_ml, notes) VALUES
-- Alex: Baseline period (Sept 10 - Sept 16)
-- Average Sleep: ~6.16 hrs, Average Screen Time: ~385 mins, Average Steps: ~6400
(1, '2026-09-10', 6.00, 5, 410, 6200, 25, 1800, 'Stayed up watching streams'),
(1, '2026-09-11', 5.50, 4, 430, 5800, 20, 1600, 'Late screen browsing, insomnia'),
(1, '2026-09-12', 6.50, 6, 360, 7100, 30, 2000, 'Slightly earlier sleep'),
(1, '2026-09-13', 5.80, 5, 390, 6000, 20, 1700, 'Tired eyes'),
(1, '2026-09-14', 6.20, 5, 420, 6500, 25, 1900, 'Phone in bed'),
(1, '2026-09-15', 7.00, 7, 310, 7200, 35, 2100, 'Better sleep'),
(1, '2026-09-16', 6.10, 5, 380, 6100, 25, 1800, 'Baseline complete'),

-- Alex: Intervention period (Sept 17 - Sept 23)
-- Average Sleep: ~7.74 hrs, Average Screen Time: ~190 mins, Average Steps: ~8300
(1, '2026-09-17', 7.50, 8, 210, 7800, 40, 2200, 'First night with curfew: fell asleep quickly'),
(1, '2026-09-18', 7.80, 8, 195, 8200, 45, 2300, 'Deep uninterrupted sleep'),
(1, '2026-09-19', 8.20, 9, 180, 9500, 50, 2400, 'Woke naturally without alarm'),
(1, '2026-09-20', 7.60, 8, 200, 8000, 40, 2200, 'Good bedtime rhythm'),
(1, '2026-09-21', 7.70, 8, 185, 8400, 45, 2300, 'No eye strain'),
(1, '2026-09-22', 7.90, 9, 175, 8600, 45, 2400, 'High daytime energy'),
(1, '2026-09-23', 7.50, 8, 185, 7800, 40, 2200, 'Intervention week complete'),

-- Sneha: Fitness & Health baseline (Sept 17 - Sept 23)
(2, '2026-09-17', 7.80, 8, 150, 11200, 55, 2800, 'Solid recovery'),
(2, '2026-09-18', 8.00, 9, 140, 10800, 50, 2600, 'Felt strong'),
(2, '2026-09-19', 8.50, 9, 130, 13500, 65, 3000, 'Trail day'),
(2, '2026-09-20', 7.50, 7, 160, 6000, 20, 2400, 'Active recovery'),
(2, '2026-09-21', 8.10, 8, 145, 11000, 55, 2700, 'Great week start'),
(2, '2026-09-22', 7.90, 8, 150, 11400, 50, 2800, 'Consistent'),
(2, '2026-09-23', 8.20, 9, 135, 12000, 60, 2900, 'Peak performance')
ON DUPLICATE KEY UPDATE sleep_hours=VALUES(sleep_hours), screen_time_minutes=VALUES(screen_time_minutes);

-- ------------------------------------------------------------------------------
-- 6. Insert Experiments
-- ------------------------------------------------------------------------------
INSERT INTO experiments (id, user_id, title, hypothesis, target_metric, habit_id, status, before_start_date, before_end_date, during_start_date, during_end_date, notes) VALUES
(1, 1, 'Digital Sunset: No Phone After 9 PM',
 'Cutting off screen time after 9:00 PM will increase average nightly sleep duration by at least 1 hour and improve morning energy.',
 'SLEEP_HOURS', 4, 'ACTIVE',
 '2026-09-10', '2026-09-16',
 '2026-09-17', '2026-09-23',
 'Comparing 7-day baseline before phone curfew against 7-day intervention with phone placed outside bedroom.'),

(2, 2, 'Morning Cardio Routine',
 'Running 5km consistently in the morning will increase total daily active minutes to over 50 minutes and elevate daily mood scores.',
 'ACTIVE_MINUTES', 5, 'COMPLETED',
 '2026-09-10', '2026-09-16',
 '2026-09-17', '2026-09-23',
 'Intervention period showed strong consistency and high mood scores.')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);
