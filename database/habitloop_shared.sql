-- ==============================================================================
-- HabitLoop Database Dump (Self-Contained Portable Clone)
-- Target RDBMS: MySQL 8.0+ / MariaDB 10.5+
-- Storage Engine: InnoDB
-- Character Set: utf8mb4 (utf8mb4_unicode_ci)
-- Generated for: Member 4 (AI + Integration + Testing)
-- Security Notice: No passwords, secrets, or machine-specific credentials included.
-- ==============================================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ------------------------------------------------------------------------------
-- 1. Database Creation
-- ------------------------------------------------------------------------------
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `habitloop`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `habitloop`;

-- ------------------------------------------------------------------------------
-- 2. Drop Existing Tables (Reverse Dependency Order)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `experiments`;
DROP TABLE IF EXISTS `health_data`;
DROP TABLE IF EXISTS `mood_logs`;
DROP TABLE IF EXISTS `habit_logs`;
DROP TABLE IF EXISTS `habit_completions`;
DROP TABLE IF EXISTS `mood_entries`;
DROP TABLE IF EXISTS `habits`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------------
-- Table Structure: users
-- Purpose: Primary user accounts for authentication, tracking, and analytics.
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `uk_users_username` UNIQUE (`username`),
    CONSTRAINT `uk_users_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table Structure: habits
-- Purpose: Habit definitions configured by a user.
-- ------------------------------------------------------------------------------
CREATE TABLE `habits` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    `frequency` VARCHAR(30) NOT NULL DEFAULT 'DAILY',
    `target_value` DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    `unit` VARCHAR(30) NOT NULL DEFAULT 'times',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_habits_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_habits_target_value` CHECK (`target_value` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_habits_user_active` ON `habits` (`user_id`, `is_active`);
CREATE INDEX `idx_habits_category` ON `habits` (`user_id`, `category`);

-- ------------------------------------------------------------------------------
-- Table Structure: habit_logs
-- Purpose: Daily habit completion tracking and progress values.
-- ------------------------------------------------------------------------------
CREATE TABLE `habit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `habit_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `log_date` DATE NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT TRUE,
    `logged_value` DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    `notes` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_habit_logs_habit` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_habit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_habit_logs_date` UNIQUE (`habit_id`, `log_date`),
    CONSTRAINT `chk_habit_logs_value` CHECK (`logged_value` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_habit_logs_user_date` ON `habit_logs` (`user_id`, `log_date`);
CREATE INDEX `idx_habit_logs_habit_date` ON `habit_logs` (`habit_id`, `log_date`);

-- ------------------------------------------------------------------------------
-- Table Structure: mood_logs
-- Purpose: Daily emotional wellbeing, mood scores (1-10), energy, and stress.
-- ------------------------------------------------------------------------------
CREATE TABLE `mood_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `log_date` DATE NOT NULL,
    `score` INT NOT NULL,
    `mood_label` VARCHAR(50) NULL,
    `energy_level` INT NULL,
    `stress_level` INT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_mood_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_mood_logs_user_date` UNIQUE (`user_id`, `log_date`),
    CONSTRAINT `chk_mood_score` CHECK (`score` BETWEEN 1 AND 10),
    CONSTRAINT `chk_mood_energy` CHECK (`energy_level` IS NULL OR (`energy_level` BETWEEN 1 AND 10)),
    CONSTRAINT `chk_mood_stress` CHECK (`stress_level` IS NULL OR (`stress_level` BETWEEN 1 AND 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_mood_logs_user_date` ON `mood_logs` (`user_id`, `log_date`);

-- ------------------------------------------------------------------------------
-- Table Structure: health_data
-- Purpose: Daily physical health metrics (sleep hours/quality, screen time, steps, activity).
-- ------------------------------------------------------------------------------
CREATE TABLE `health_data` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `record_date` DATE NOT NULL,
    `sleep_hours` DECIMAL(4,2) NULL,
    `sleep_quality` INT NULL,
    `screen_time_minutes` INT NULL,
    `step_count` INT NULL,
    `active_minutes` INT NULL,
    `water_intake_ml` INT NULL,
    `notes` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_health_data_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_health_data_user_date` UNIQUE (`user_id`, `record_date`),
    CONSTRAINT `chk_health_sleep_hours` CHECK (`sleep_hours` IS NULL OR (`sleep_hours` >= 0.00 AND `sleep_hours` <= 24.00)),
    CONSTRAINT `chk_health_sleep_quality` CHECK (`sleep_quality` IS NULL OR (`sleep_quality` BETWEEN 1 AND 10)),
    CONSTRAINT `chk_health_screen_time` CHECK (`screen_time_minutes` IS NULL OR (`screen_time_minutes` >= 0 AND `screen_time_minutes` <= 1440)),
    CONSTRAINT `chk_health_step_count` CHECK (`step_count` IS NULL OR `step_count` >= 0),
    CONSTRAINT `chk_health_active_minutes` CHECK (`active_minutes` IS NULL OR (`active_minutes` >= 0 AND `active_minutes` <= 1440)),
    CONSTRAINT `chk_health_water_intake` CHECK (`water_intake_ml` IS NULL OR `water_intake_ml` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_health_data_user_date` ON `health_data` (`user_id`, `record_date`);

-- ------------------------------------------------------------------------------
-- Table Structure: experiments
-- Purpose: Personal self-experiments comparing metrics before vs. during intervention.
-- ------------------------------------------------------------------------------
CREATE TABLE `experiments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `hypothesis` TEXT NULL,
    `target_metric` VARCHAR(50) NOT NULL,
    `habit_id` BIGINT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    `before_start_date` DATE NOT NULL,
    `before_end_date` DATE NOT NULL,
    `during_start_date` DATE NOT NULL,
    `during_end_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_experiments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_experiments_habit` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_exp_before_dates` CHECK (`before_start_date` <= `before_end_date`),
    CONSTRAINT `chk_exp_during_dates` CHECK (`during_start_date` <= `during_end_date`),
    CONSTRAINT `chk_exp_periods` CHECK (`before_end_date` <= `during_start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_experiments_user_status` ON `experiments` (`user_id`, `status`);

-- ------------------------------------------------------------------------------
-- Table Structure: habit_completions (Backend Entity Integration Support)
-- Purpose: Discrete completion timestamps supported by HabitCompletion entity.
-- ------------------------------------------------------------------------------
CREATE TABLE `habit_completions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `habit_id` BIGINT NOT NULL,
    `completion_date` DATE NOT NULL,
    `completed_at` DATETIME(6) NOT NULL,
    CONSTRAINT `fk_habit_completions_habit` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_habit_completions_habit_date` ON `habit_completions` (`habit_id`, `completion_date`);

-- ------------------------------------------------------------------------------
-- Table Structure: mood_entries (Backend Entity Integration Support)
-- Purpose: Discrete mood entries supported by MoodEntry entity.
-- ------------------------------------------------------------------------------
CREATE TABLE `mood_entries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `mood_score` INT NULL,
    `mood_label` VARCHAR(255) NULL,
    `note` VARCHAR(1000) NULL,
    `entry_date` DATE NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    CONSTRAINT `fk_mood_entries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_mood_entries_user_date` ON `mood_entries` (`user_id`, `entry_date`);


-- ==============================================================================
-- 3. Data Population (Seed & Baseline Test Data)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 3.1 Insert Users
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `created_at`, `updated_at`) VALUES
(1, 'alex_dev', 'alex@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Alex', 'Chen', '2026-09-01 08:00:00', '2026-09-01 08:00:00'),
(2, 'sneha_runner', 'sneha@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Sneha', 'Patel', '2026-09-01 08:00:00', '2026-09-01 08:00:00'),
(3, 'jordan_new', 'jordan@habitloop.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8H5s0t1rA2B3C4D5E6F7G8H9I0J1K2', 'Jordan', 'Taylor', '2026-09-15 09:30:00', '2026-09-15 09:30:00');

-- ------------------------------------------------------------------------------
-- 3.2 Insert Habits
-- ------------------------------------------------------------------------------
INSERT INTO `habits` (`id`, `user_id`, `name`, `description`, `category`, `frequency`, `target_value`, `unit`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Morning Meditation', '10-minute mindfulness breathing session', 'MINDFULNESS', 'DAILY', 10.00, 'minutes', TRUE, '2026-09-01 08:30:00', '2026-09-01 08:30:00'),
(2, 1, 'Read 20 Pages', 'Read non-fiction or career book daily', 'PRODUCTIVITY', 'DAILY', 20.00, 'pages', TRUE, '2026-09-01 08:30:00', '2026-09-01 08:30:00'),
(3, 1, 'Drink 2L Water', 'Stay hydrated throughout the day', 'HEALTH', 'DAILY', 2000.00, 'ml', TRUE, '2026-09-01 08:30:00', '2026-09-01 08:30:00'),
(4, 1, 'Digital Sunset Curfew', 'Put away screens and phone by 9:00 PM', 'LIFESTYLE', 'DAILY', 1.00, 'times', TRUE, '2026-09-01 08:30:00', '2026-09-01 08:30:00'),
(5, 2, 'Morning 5km Run', 'Outdoor jogging or treadmill run', 'FITNESS', 'DAILY', 5.00, 'km', TRUE, '2026-09-01 09:00:00', '2026-09-01 09:00:00'),
(6, 2, 'No Refined Sugar', 'Avoid sugary snacks and sodas', 'HEALTH', 'DAILY', 1.00, 'times', TRUE, '2026-09-01 09:00:00', '2026-09-01 09:00:00'),
(7, 3, 'Evening Walk', 'Gentle 15-minute neighborhood walk', 'FITNESS', 'DAILY', 15.00, 'minutes', TRUE, '2026-09-15 10:00:00', '2026-09-15 10:00:00');

-- ------------------------------------------------------------------------------
-- 3.3 Insert Habit Logs (14-day history for Alex & Sneha)
-- ------------------------------------------------------------------------------
INSERT INTO `habit_logs` (`habit_id`, `user_id`, `log_date`, `completed`, `logged_value`, `notes`, `created_at`) VALUES
-- Alex: Meditation (Habit 1)
(1, 1, '2026-09-10', TRUE, 10.00, 'Felt calm', '2026-09-10 07:30:00'),
(1, 1, '2026-09-11', TRUE, 10.00, 'Morning session', '2026-09-11 07:30:00'),
(1, 1, '2026-09-12', FALSE, 0.00, 'Overslept', '2026-09-12 08:00:00'),
(1, 1, '2026-09-13', TRUE, 10.00, 'Focused breathing', '2026-09-13 07:30:00'),
(1, 1, '2026-09-14', TRUE, 12.00, 'Extra 2 mins', '2026-09-14 07:30:00'),
(1, 1, '2026-09-15', TRUE, 10.00, 'Good session', '2026-09-15 07:30:00'),
(1, 1, '2026-09-16', TRUE, 10.00, 'Mid-day reset', '2026-09-16 12:30:00'),
(1, 1, '2026-09-17', TRUE, 10.00, 'Consistent', '2026-09-17 07:30:00'),
(1, 1, '2026-09-18', TRUE, 10.00, 'Nice and quiet', '2026-09-18 07:30:00'),
(1, 1, '2026-09-19', TRUE, 15.00, 'Weekend extended meditation', '2026-09-19 08:30:00'),
(1, 1, '2026-09-20', TRUE, 10.00, 'Ready for the week', '2026-09-20 07:30:00'),
(1, 1, '2026-09-21', TRUE, 10.00, 'Refreshed', '2026-09-21 07:30:00'),
(1, 1, '2026-09-22', TRUE, 10.00, 'On track', '2026-09-22 07:30:00'),
(1, 1, '2026-09-23', TRUE, 10.00, 'Solid routine', '2026-09-23 07:30:00'),

-- Alex: Read 20 Pages (Habit 2)
(2, 1, '2026-09-10', TRUE, 22.00, 'Finished chapter 3', '2026-09-10 21:00:00'),
(2, 1, '2026-09-11', TRUE, 20.00, 'Great insights', '2026-09-11 21:00:00'),
(2, 1, '2026-09-12', TRUE, 25.00, 'Could not put it down', '2026-09-12 21:30:00'),
(2, 1, '2026-09-13', FALSE, 10.00, 'Tired, read only 10 pages', '2026-09-13 21:00:00'),
(2, 1, '2026-09-14', TRUE, 20.00, 'On target', '2026-09-14 21:00:00'),
(2, 1, '2026-09-15', TRUE, 20.00, 'Good progress', '2026-09-15 21:00:00'),
(2, 1, '2026-09-16', FALSE, 0.00, 'Busy with assignments', '2026-09-16 22:00:00'),
(2, 1, '2026-09-17', TRUE, 25.00, 'Back on track', '2026-09-17 21:00:00'),
(2, 1, '2026-09-18', TRUE, 20.00, 'Chapter 7', '2026-09-18 21:00:00'),
(2, 1, '2026-09-19', TRUE, 30.00, 'Weekend reading marathon', '2026-09-19 22:00:00'),
(2, 1, '2026-09-20', TRUE, 20.00, 'Consistent', '2026-09-20 21:00:00'),
(2, 1, '2026-09-21', TRUE, 20.00, 'Productive day', '2026-09-21 21:00:00'),
(2, 1, '2026-09-22', TRUE, 22.00, 'Almost done with book', '2026-09-22 21:00:00'),
(2, 1, '2026-09-23', TRUE, 20.00, 'Target reached', '2026-09-23 21:00:00'),

-- Alex: Digital Sunset Curfew (Habit 4 - Linked to Experiment 1)
(4, 1, '2026-09-10', FALSE, 0.00, 'Browsed YouTube until midnight', '2026-09-10 23:59:00'),
(4, 1, '2026-09-11', FALSE, 0.00, 'Late night discord chat', '2026-09-11 23:59:00'),
(4, 1, '2026-09-12', TRUE, 1.00, 'Put phone away at 9', '2026-09-12 21:00:00'),
(4, 1, '2026-09-13', FALSE, 0.00, 'Late work email', '2026-09-13 23:59:00'),
(4, 1, '2026-09-14', FALSE, 0.00, 'Watched video', '2026-09-14 23:59:00'),
(4, 1, '2026-09-15', TRUE, 1.00, 'Stopped early', '2026-09-15 21:00:00'),
(4, 1, '2026-09-16', FALSE, 0.00, 'Late screen usage', '2026-09-16 23:59:00'),
(4, 1, '2026-09-17', TRUE, 1.00, 'Experiment day 1: Screen off at 9', '2026-09-17 21:00:00'),
(4, 1, '2026-09-18', TRUE, 1.00, 'Experiment day 2: Phone charging in desk', '2026-09-18 21:00:00'),
(4, 1, '2026-09-19', TRUE, 1.00, 'Experiment day 3: Read paperback instead', '2026-09-19 21:00:00'),
(4, 1, '2026-09-20', TRUE, 1.00, 'Experiment day 4: Screen off at 9', '2026-09-20 21:00:00'),
(4, 1, '2026-09-21', TRUE, 1.00, 'Experiment day 5: Very peaceful sleep', '2026-09-21 21:00:00'),
(4, 1, '2026-09-22', TRUE, 1.00, 'Experiment day 6: Solid adherence', '2026-09-22 21:00:00'),
(4, 1, '2026-09-23', TRUE, 1.00, 'Experiment day 7: Completed full week!', '2026-09-23 21:00:00'),

-- Sneha: 5km Run (Habit 5)
(5, 2, '2026-09-17', TRUE, 5.20, 'Felt energized', '2026-09-17 06:45:00'),
(5, 2, '2026-09-18', TRUE, 5.00, 'Morning pace 5:30/km', '2026-09-18 06:45:00'),
(5, 2, '2026-09-19', TRUE, 6.00, 'Long run Saturday', '2026-09-19 07:15:00'),
(5, 2, '2026-09-20', FALSE, 0.00, 'Rest day', '2026-09-20 08:00:00'),
(5, 2, '2026-09-21', TRUE, 5.10, 'Back on track', '2026-09-21 06:45:00'),
(5, 2, '2026-09-22', TRUE, 5.00, 'Cool weather run', '2026-09-22 06:45:00'),
(5, 2, '2026-09-23', TRUE, 5.30, 'Great finish', '2026-09-23 06:45:00');

-- ------------------------------------------------------------------------------
-- 3.4 Insert Mood Logs (14-day history for Alex, 7-day for Sneha)
-- ------------------------------------------------------------------------------
INSERT INTO `mood_logs` (`user_id`, `log_date`, `score`, `mood_label`, `energy_level`, `stress_level`, `notes`, `created_at`) VALUES
-- Alex: Baseline period (Sept 10 - Sept 16)
(1, '2026-09-10', 6, 'Tired', 5, 7, 'Sluggish morning, stayed up late', '2026-09-10 22:00:00'),
(1, '2026-09-11', 5, 'Stressed', 4, 8, 'Felt tired all day from lack of sleep', '2026-09-11 22:00:00'),
(1, '2026-09-12', 7, 'Neutral', 6, 6, 'Decent day, got some work done', '2026-09-12 22:00:00'),
(1, '2026-09-13', 6, 'Tired', 4, 7, 'Hard to focus in the afternoon', '2026-09-13 22:00:00'),
(1, '2026-09-14', 5, 'Anxious', 4, 8, 'Deadlines piling up', '2026-09-14 22:00:00'),
(1, '2026-09-15', 7, 'Calm', 6, 5, 'Relaxed evening', '2026-09-15 22:00:00'),
(1, '2026-09-16', 6, 'Neutral', 5, 7, 'Ready to start sleep experiment', '2026-09-16 22:00:00'),

-- Alex: Intervention period (Sept 17 - Sept 23)
(1, '2026-09-17', 8, 'Refreshed', 7, 4, 'Woke up easily, no phone before bed helped', '2026-09-17 22:00:00'),
(1, '2026-09-18', 8, 'Productive', 8, 4, 'High morning energy, great focus', '2026-09-18 22:00:00'),
(1, '2026-09-19', 9, 'Happy', 8, 3, 'Wonderful Saturday, felt well-rested', '2026-09-19 22:00:00'),
(1, '2026-09-20', 8, 'Calm', 7, 4, 'Ready for Sunday prep without screen stress', '2026-09-20 22:00:00'),
(1, '2026-09-21', 8, 'Energetic', 8, 5, 'Monday felt surprisingly easy', '2026-09-21 22:00:00'),
(1, '2026-09-22', 9, 'Productive', 9, 3, 'Flow state throughout the afternoon', '2026-09-22 22:00:00'),
(1, '2026-09-23', 9, 'Great', 9, 3, 'End of week 1 experiment: massive mood boost', '2026-09-23 22:00:00'),

-- Sneha: Fitness & Health baseline (Sept 17 - Sept 23)
(2, '2026-09-17', 8, 'Energetic', 8, 4, 'Post-run high', '2026-09-17 21:00:00'),
(2, '2026-09-18', 8, 'Great', 8, 3, 'Clear focus today', '2026-09-18 21:00:00'),
(2, '2026-09-19', 9, 'Joyful', 9, 2, 'Weekend trail running', '2026-09-19 21:00:00'),
(2, '2026-09-20', 7, 'Calm', 6, 3, 'Restful Sunday', '2026-09-20 21:00:00'),
(2, '2026-09-21', 8, 'Motivated', 8, 4, 'Strong start to the week', '2026-09-21 21:00:00'),
(2, '2026-09-22', 8, 'Energetic', 8, 3, 'Good recovery', '2026-09-22 21:00:00'),
(2, '2026-09-23', 9, 'Accomplished', 9, 2, 'Finished 5k PR', '2026-09-23 21:00:00');

-- ------------------------------------------------------------------------------
-- 3.5 Insert Health Data (Sleep, Screen Time, Steps, Activity, Water)
-- ------------------------------------------------------------------------------
INSERT INTO `health_data` (`user_id`, `record_date`, `sleep_hours`, `sleep_quality`, `screen_time_minutes`, `step_count`, `active_minutes`, `water_intake_ml`, `notes`, `created_at`) VALUES
-- Alex: Baseline period (Sept 10 - Sept 16)
(1, '2026-09-10', 6.00, 5, 410, 6200, 25, 1800, 'Stayed up watching streams', '2026-09-10 23:00:00'),
(1, '2026-09-11', 5.50, 4, 430, 5800, 20, 1600, 'Late screen browsing, insomnia', '2026-09-11 23:00:00'),
(1, '2026-09-12', 6.50, 6, 360, 7100, 30, 2000, 'Slightly earlier sleep', '2026-09-12 23:00:00'),
(1, '2026-09-13', 5.80, 5, 390, 6000, 20, 1700, 'Tired eyes', '2026-09-13 23:00:00'),
(1, '2026-09-14', 6.20, 5, 420, 6500, 25, 1900, 'Phone in bed', '2026-09-14 23:00:00'),
(1, '2026-09-15', 7.00, 7, 310, 7200, 35, 2100, 'Better sleep', '2026-09-15 23:00:00'),
(1, '2026-09-16', 6.10, 5, 380, 6100, 25, 1800, 'Baseline complete', '2026-09-16 23:00:00'),

-- Alex: Intervention period (Sept 17 - Sept 23)
(1, '2026-09-17', 7.50, 8, 210, 7800, 40, 2200, 'First night with curfew: fell asleep quickly', '2026-09-17 23:00:00'),
(1, '2026-09-18', 7.80, 8, 195, 8200, 45, 2300, 'Deep uninterrupted sleep', '2026-09-18 23:00:00'),
(1, '2026-09-19', 8.20, 9, 180, 9500, 50, 2400, 'Woke naturally without alarm', '2026-09-19 23:00:00'),
(1, '2026-09-20', 7.60, 8, 200, 8000, 40, 2200, 'Good bedtime rhythm', '2026-09-20 23:00:00'),
(1, '2026-09-21', 7.70, 8, 185, 8400, 45, 2300, 'No eye strain', '2026-09-21 23:00:00'),
(1, '2026-09-22', 7.90, 9, 175, 8600, 45, 2400, 'High daytime energy', '2026-09-22 23:00:00'),
(1, '2026-09-23', 7.50, 8, 185, 7800, 40, 2200, 'Intervention week complete', '2026-09-23 23:00:00'),

-- Sneha: Fitness & Health baseline (Sept 17 - Sept 23)
(2, '2026-09-17', 7.80, 8, 150, 11200, 55, 2800, 'Solid recovery', '2026-09-17 22:00:00'),
(2, '2026-09-18', 8.00, 9, 140, 10800, 50, 2600, 'Felt strong', '2026-09-18 22:00:00'),
(2, '2026-09-19', 8.50, 9, 130, 13500, 65, 3000, 'Trail day', '2026-09-19 22:00:00'),
(2, '2026-09-20', 7.50, 7, 160, 6000, 20, 2400, 'Active recovery', '2026-09-20 22:00:00'),
(2, '2026-09-21', 8.10, 8, 145, 11000, 55, 2700, 'Great week start', '2026-09-21 22:00:00'),
(2, '2026-09-22', 7.90, 8, 150, 11400, 50, 2800, 'Consistent', '2026-09-22 22:00:00'),
(2, '2026-09-23', 8.20, 9, 135, 12000, 60, 2900, 'Peak performance', '2026-09-23 22:00:00');

-- ------------------------------------------------------------------------------
-- 3.6 Insert Experiments
-- ------------------------------------------------------------------------------
INSERT INTO `experiments` (`id`, `user_id`, `title`, `hypothesis`, `target_metric`, `habit_id`, `status`, `before_start_date`, `before_end_date`, `during_start_date`, `during_end_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Digital Sunset: No Phone After 9 PM',
 'Cutting off screen time after 9:00 PM will increase average nightly sleep duration by at least 1 hour and improve morning energy.',
 'SLEEP_HOURS', 4, 'ACTIVE',
 '2026-09-10', '2026-09-16',
 '2026-09-17', '2026-09-23',
 'Comparing 7-day baseline before phone curfew against 7-day intervention with phone placed outside bedroom.', '2026-09-09 20:00:00', '2026-09-17 08:00:00'),

(2, 2, 'Morning Cardio Routine',
 'Running 5km consistently in the morning will increase total daily active minutes to over 50 minutes and elevate daily mood scores.',
 'ACTIVE_MINUTES', 5, 'COMPLETED',
 '2026-09-10', '2026-09-16',
 '2026-09-17', '2026-09-23',
 'Intervention period showed strong consistency and high mood scores.', '2026-09-09 20:00:00', '2026-09-24 09:00:00');

-- ------------------------------------------------------------------------------
-- 3.7 Insert Sample Habit Completions (Backend Integration Support)
-- ------------------------------------------------------------------------------
INSERT INTO `habit_completions` (`id`, `habit_id`, `completion_date`, `completed_at`) VALUES
(1, 1, '2026-09-21', '2026-09-21 07:30:00'),
(2, 1, '2026-09-22', '2026-09-22 07:30:00'),
(3, 1, '2026-09-23', '2026-09-23 07:30:00'),
(4, 2, '2026-09-21', '2026-09-21 21:00:00'),
(5, 2, '2026-09-22', '2026-09-22 21:00:00'),
(6, 2, '2026-09-23', '2026-09-23 21:00:00'),
(7, 4, '2026-09-21', '2026-09-21 21:00:00'),
(8, 4, '2026-09-22', '2026-09-22 21:00:00'),
(9, 4, '2026-09-23', '2026-09-23 21:00:00'),
(10, 5, '2026-09-21', '2026-09-21 06:45:00'),
(11, 5, '2026-09-22', '2026-09-22 06:45:00'),
(12, 5, '2026-09-23', '2026-09-23 06:45:00');

-- ------------------------------------------------------------------------------
-- 3.8 Insert Sample Mood Entries (Backend Integration Support)
-- ------------------------------------------------------------------------------
INSERT INTO `mood_entries` (`id`, `user_id`, `mood_score`, `mood_label`, `note`, `entry_date`, `created_at`) VALUES
(1, 1, 8, 'Energetic', 'Monday felt surprisingly easy', '2026-09-21', '2026-09-21 22:00:00'),
(2, 1, 9, 'Productive', 'Flow state throughout the afternoon', '2026-09-22', '2026-09-22 22:00:00'),
(3, 1, 9, 'Great', 'End of week 1 experiment: massive mood boost', '2026-09-23', '2026-09-23 22:00:00'),
(4, 2, 8, 'Motivated', 'Strong start to the week', '2026-09-21', '2026-09-21 21:00:00'),
(5, 2, 8, 'Energetic', 'Good recovery', '2026-09-22', '2026-09-22 21:00:00'),
(6, 2, 9, 'Accomplished', 'Finished 5k PR', '2026-09-23', '2026-09-23 21:00:00');

-- ------------------------------------------------------------------------------
-- 4. Restore Environment Settings
-- ------------------------------------------------------------------------------
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- ==============================================================================
-- End of HabitLoop Database Dump
-- ==============================================================================
