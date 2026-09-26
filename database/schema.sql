-- ==============================================================================
-- HabitLoop Database Schema
-- Database: MySQL 8.0+
-- Role: Person 3 (Database + Analytics)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS habitloop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE habitloop;

-- ------------------------------------------------------------------------------
-- Table 1: users
-- Purpose: Primary user accounts for habit tracking, health logs, and experiments.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: habits
-- Purpose: Habit definitions configured by a user.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    frequency VARCHAR(30) NOT NULL DEFAULT 'DAILY',
    target_value DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    unit VARCHAR(30) NOT NULL DEFAULT 'times',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_habits_target_value CHECK (target_value > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_habits_user_active ON habits (user_id, is_active);
CREATE INDEX idx_habits_category ON habits (user_id, category);

-- ------------------------------------------------------------------------------
-- Table 3: habit_logs
-- Purpose: Daily habit completion tracking and progress values.
-- Constraints: Unique on (habit_id, log_date) prevents duplicate entries per day.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    habit_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    logged_value DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_habit_logs_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    CONSTRAINT fk_habit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_habit_logs_date UNIQUE (habit_id, log_date),
    CONSTRAINT chk_habit_logs_value CHECK (logged_value >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_habit_logs_user_date ON habit_logs (user_id, log_date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs (habit_id, log_date);

-- ------------------------------------------------------------------------------
-- Table 4: mood_logs
-- Purpose: Daily emotional wellbeing, mood scores (1-10), energy, and stress.
-- Constraints: Unique on (user_id, log_date) ensures one consolidated daily mood log.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mood_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    score INT NOT NULL,
    mood_label VARCHAR(50) NULL,
    energy_level INT NULL,
    stress_level INT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mood_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_mood_logs_user_date UNIQUE (user_id, log_date),
    CONSTRAINT chk_mood_score CHECK (score BETWEEN 1 AND 10),
    CONSTRAINT chk_mood_energy CHECK (energy_level IS NULL OR (energy_level BETWEEN 1 AND 10)),
    CONSTRAINT chk_mood_stress CHECK (stress_level IS NULL OR (stress_level BETWEEN 1 AND 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_mood_logs_user_date ON mood_logs (user_id, log_date);

-- ------------------------------------------------------------------------------
-- Table 5: health_data
-- Purpose: Daily physical health metrics (sleep hours/quality, screen time, steps, activity).
-- Constraints: Unique on (user_id, record_date) ensures one daily record per user.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS health_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    sleep_hours DECIMAL(4,2) NULL,
    sleep_quality INT NULL,
    screen_time_minutes INT NULL,
    step_count INT NULL,
    active_minutes INT NULL,
    water_intake_ml INT NULL,
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_health_data_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_health_data_user_date UNIQUE (user_id, record_date),
    CONSTRAINT chk_health_sleep_hours CHECK (sleep_hours IS NULL OR (sleep_hours >= 0.00 AND sleep_hours <= 24.00)),
    CONSTRAINT chk_health_sleep_quality CHECK (sleep_quality IS NULL OR (sleep_quality BETWEEN 1 AND 10)),
    CONSTRAINT chk_health_screen_time CHECK (screen_time_minutes IS NULL OR (screen_time_minutes >= 0 AND screen_time_minutes <= 1440)),
    CONSTRAINT chk_health_step_count CHECK (step_count IS NULL OR step_count >= 0),
    CONSTRAINT chk_health_active_minutes CHECK (active_minutes IS NULL OR (active_minutes >= 0 AND active_minutes <= 1440)),
    CONSTRAINT chk_health_water_intake CHECK (water_intake_ml IS NULL OR water_intake_ml >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_health_data_user_date ON health_data (user_id, record_date);

-- ------------------------------------------------------------------------------
-- Table 6: experiments
-- Purpose: Personal self-experiments comparing metrics before vs. during/after intervention.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    hypothesis TEXT NULL,
    target_metric VARCHAR(50) NOT NULL,
    habit_id BIGINT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    before_start_date DATE NOT NULL,
    before_end_date DATE NOT NULL,
    during_start_date DATE NOT NULL,
    during_end_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_experiments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_experiments_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
    CONSTRAINT chk_exp_before_dates CHECK (before_start_date <= before_end_date),
    CONSTRAINT chk_exp_during_dates CHECK (during_start_date <= during_end_date),
    CONSTRAINT chk_exp_periods CHECK (before_end_date <= during_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_experiments_user_status ON experiments (user_id, status);
