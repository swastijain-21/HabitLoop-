import sqlite3
import re
import os
import math
import sys
from datetime import date, timedelta
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from run_database_tests import build_sqlite_schema, load_seed_data

class AnalyticsCalculationHelperPy:
    @staticmethod
    def round_val(val, places=2):
        if val is None or math.isnan(val) or math.isinf(val):
            return None
        return round(val, places)

    @staticmethod
    def mean(values):
        non_null = [v for v in values if v is not None]
        if not non_null:
            return None
        return round(sum(non_null) / len(non_null), 2)

    @staticmethod
    def min_val(values):
        non_null = [v for v in values if v is not None]
        if not non_null:
            return None
        return round(min(non_null), 2)

    @staticmethod
    def max_val(values):
        non_null = [v for v in values if v is not None]
        if not non_null:
            return None
        return round(max(non_null), 2)

    @staticmethod
    def safe_absolute_change(before, after):
        if before is None or after is None:
            return None
        return round(after - before, 2)

    @staticmethod
    def safe_percentage_change(before, after):
        if before is None or after is None:
            return None
        if before == 0.0:
            return 0.0 if after == 0.0 else None
        return round(((after - before) / abs(before)) * 100.0, 2)

    @staticmethod
    def determine_trend(chronological_values):
        non_null = [v for v in (chronological_values or []) if v is not None]
        if len(non_null) < 2:
            return "INSUFFICIENT_DATA"
        mid = len(non_null) // 2
        first_half = non_null[:mid]
        second_half = non_null[mid:]
        first_avg = sum(first_half) / len(first_half)
        second_avg = sum(second_half) / len(second_half)
        if first_avg == 0:
            diff = second_avg - first_avg
            if diff > 0.05: return "IMPROVING"
            if diff < -0.05: return "DECLINING"
            return "STABLE"
        pct = ((second_avg - first_avg) / abs(first_avg)) * 100.0
        if pct > 3.0: return "IMPROVING"
        elif pct < -3.0: return "DECLINING"
        return "STABLE"

def test_habit_analytics(conn):
    print("\n--- [TEST GROUP 1: HABIT ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # User 1 (Alex)
    cursor.execute("SELECT id, name, is_active FROM habits WHERE user_id = 1")
    habits = cursor.fetchall()
    total_habits = len(habits)
    active_habits = len([h for h in habits if h[2] == 1])
    print(f"User 1: Total Habits = {total_habits}, Active = {active_habits}")
    assert total_habits == 4, f"Expected 4 habits, got {total_habits}"
    assert active_habits == 4, f"Expected 4 active habits, got {active_habits}"

    # Habit 1: Meditation logs
    cursor.execute("SELECT log_date, completed FROM habit_logs WHERE habit_id = 1 ORDER BY log_date ASC")
    logs = cursor.fetchall()
    total_logs = len(logs)
    completed_logs = len([l for l in logs if l[1] == 1])
    incomplete_logs = total_logs - completed_logs
    completion_rate = calc.round_val((completed_logs / total_logs) * 100.0)

    print(f"Habit 1 (Meditation): Total Logs = {total_logs}, Completed = {completed_logs}, Incomplete = {incomplete_logs}, Rate = {completion_rate}%")
    assert total_logs == 14, f"Expected 14 logs, got {total_logs}"
    assert completed_logs == 13, f"Expected 13 completed, got {completed_logs}"
    assert incomplete_logs == 1, f"Expected 1 incomplete, got {incomplete_logs}"
    assert completion_rate == 92.86, f"Expected 92.86%, got {completion_rate}%"

    # Current streak calculation for Habit 1 (completed every day from Sept 13 to Sept 23 inclusive = 11 days)
    # Check streak algorithm
    sorted_dates = sorted([l[0] for l in logs if l[1] == 1], reverse=True)
    streak = 1
    for i in range(len(sorted_dates) - 1):
        d1 = date.fromisoformat(sorted_dates[i])
        d2 = date.fromisoformat(sorted_dates[i+1])
        if (d1 - d2).days == 1:
            streak += 1
        else:
            break
    print(f"Habit 1 Current Streak = {streak} days")
    assert streak == 11, f"Expected streak of 11, got {streak}"

    # Habit 4 (Curfew): Baseline vs Intervention
    cursor.execute("SELECT completed FROM habit_logs WHERE habit_id = 4 AND log_date BETWEEN '2026-09-10' AND '2026-09-16'")
    b_logs = cursor.fetchall()
    b_rate = calc.round_val((len([l for l in b_logs if l[0] == 1]) / len(b_logs)) * 100.0)

    cursor.execute("SELECT completed FROM habit_logs WHERE habit_id = 4 AND log_date BETWEEN '2026-09-17' AND '2026-09-23'")
    d_logs = cursor.fetchall()
    d_rate = calc.round_val((len([l for l in d_logs if l[0] == 1]) / len(d_logs)) * 100.0)

    print(f"Habit 4 (Curfew): Baseline Rate = {b_rate}%, Intervention Rate = {d_rate}%")
    assert b_rate == 28.57, f"Expected 28.57%, got {b_rate}%"
    assert d_rate == 100.0, f"Expected 100.0%, got {d_rate}%"
    print("  [PASS] Habit Analytics calculations verified.")

def test_sleep_analytics(conn):
    print("\n--- [TEST GROUP 2: SLEEP ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # User 1 Baseline: 2026-09-10 to 2026-09-16
    cursor.execute("SELECT sleep_hours, sleep_quality FROM health_data WHERE user_id = 1 AND record_date BETWEEN '2026-09-10' AND '2026-09-16'")
    rows_b = cursor.fetchall()
    hours_b = [r[0] for r in rows_b]
    avg_b = calc.mean(hours_b)
    min_b = calc.min_val(hours_b)
    max_b = calc.max_val(hours_b)
    print(f"Sleep Baseline: Mean = {avg_b} hrs, Min = {min_b} hrs, Max = {max_b} hrs")
    assert avg_b == 6.16, f"Expected 6.16, got {avg_b}"
    assert min_b == 5.50, f"Expected 5.50, got {min_b}"
    assert max_b == 7.00, f"Expected 7.00, got {max_b}"

    # User 1 Intervention: 2026-09-17 to 2026-09-23
    cursor.execute("SELECT sleep_hours, sleep_quality FROM health_data WHERE user_id = 1 AND record_date BETWEEN '2026-09-17' AND '2026-09-23'")
    rows_d = cursor.fetchall()
    hours_d = [r[0] for r in rows_d]
    avg_d = calc.mean(hours_d)
    min_d = calc.min_val(hours_d)
    max_d = calc.max_val(hours_d)
    print(f"Sleep Intervention: Mean = {avg_d} hrs, Min = {min_d} hrs, Max = {max_d} hrs")
    assert avg_d == 7.74, f"Expected 7.74, got {avg_d}"
    assert min_d == 7.50, f"Expected 7.50, got {min_d}"
    assert max_d == 8.20, f"Expected 8.20, got {max_d}"

    # Period Comparison
    abs_change = calc.safe_absolute_change(avg_b, avg_d)
    pct_change = calc.safe_percentage_change(avg_b, avg_d)
    print(f"Sleep Comparison: Absolute = +{abs_change} hrs, Percentage = +{pct_change}%")
    assert abs_change == 1.58, f"Expected +1.58 hrs, got {abs_change}"
    assert pct_change == 25.65, f"Expected +25.65%, got {pct_change}"

    trend = calc.determine_trend(hours_b + hours_d)
    print(f"Overall Sleep Trend: {trend}")
    assert trend == "IMPROVING", f"Expected IMPROVING, got {trend}"
    print("  [PASS] Sleep Analytics calculations verified.")

def test_mood_analytics(conn):
    print("\n--- [TEST GROUP 3: MOOD ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # User 1 Baseline
    cursor.execute("SELECT score, energy_level, stress_level, mood_label FROM mood_logs WHERE user_id = 1 AND log_date BETWEEN '2026-09-10' AND '2026-09-16'")
    rows_b = cursor.fetchall()
    scores_b = [r[0] for r in rows_b]
    avg_b = calc.mean(scores_b)
    print(f"Mood Baseline: Mean Score = {avg_b}/10")
    assert avg_b == 6.00, f"Expected 6.00, got {avg_b}"

    # User 1 Intervention
    cursor.execute("SELECT score, energy_level, stress_level, mood_label FROM mood_logs WHERE user_id = 1 AND log_date BETWEEN '2026-09-17' AND '2026-09-23'")
    rows_d = cursor.fetchall()
    scores_d = [r[0] for r in rows_d]
    avg_d = calc.mean(scores_d)
    print(f"Mood Intervention: Mean Score = {avg_d}/10")
    assert avg_d == 8.43, f"Expected 8.43, got {avg_d}"

    abs_change = calc.safe_absolute_change(avg_b, avg_d)
    pct_change = calc.safe_percentage_change(avg_b, avg_d)
    print(f"Mood Comparison: Absolute = +{abs_change} pts, Percentage = +{pct_change}%")
    assert abs_change == 2.43, f"Expected +2.43 pts, got {abs_change}"
    assert pct_change == 40.50, f"Expected +40.50%, got {pct_change}"
    print("  [PASS] Mood Analytics calculations verified.")

def test_screentime_analytics(conn):
    print("\n--- [TEST GROUP 4: SCREEN-TIME ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    cursor.execute("SELECT screen_time_minutes FROM health_data WHERE user_id = 1 AND record_date BETWEEN '2026-09-10' AND '2026-09-16'")
    mins_b = [r[0] for r in cursor.fetchall()]
    avg_b = calc.mean(mins_b)

    cursor.execute("SELECT screen_time_minutes FROM health_data WHERE user_id = 1 AND record_date BETWEEN '2026-09-17' AND '2026-09-23'")
    mins_d = [r[0] for r in cursor.fetchall()]
    avg_d = calc.mean(mins_d)

    print(f"Screen Time Baseline: {avg_b} mins/day ({calc.round_val(avg_b/60.0)} hrs/day)")
    print(f"Screen Time Intervention: {avg_d} mins/day ({calc.round_val(avg_d/60.0)} hrs/day)")
    assert avg_b == 385.71, f"Expected 385.71, got {avg_b}"
    assert avg_d == 190.00, f"Expected 190.00, got {avg_d}"

    abs_change = calc.safe_absolute_change(avg_b, avg_d)
    pct_change = calc.safe_percentage_change(avg_b, avg_d)
    print(f"Screen Time Comparison: Absolute = {abs_change} mins, Percentage = {pct_change}%")
    assert abs_change == -195.71, f"Expected -195.71 mins, got {abs_change}"
    assert pct_change == -50.74, f"Expected -50.74%, got {pct_change}"
    print("  [PASS] Screen Time Analytics calculations verified.")

def test_activity_analytics(conn):
    print("\n--- [TEST GROUP 5: ACTIVITY ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # User 2 (Sneha)
    cursor.execute("SELECT step_count, active_minutes, water_intake_ml FROM health_data WHERE user_id = 2")
    rows = cursor.fetchall()
    steps = [r[0] for r in rows]
    active = [r[1] for r in rows]
    water = [r[2] for r in rows]

    avg_steps = calc.mean(steps)
    total_steps = sum(steps)
    avg_active = calc.mean(active)
    total_active = sum(active)
    avg_water = calc.mean(water)

    print(f"User 2 Activity: Avg Steps = {avg_steps}, Total Steps = {total_steps}")
    print(f"User 2 Activity: Avg Active Mins = {avg_active}, Total Active = {total_active} mins")
    print(f"User 2 Hydration: Avg Water = {avg_water} ml")
    assert avg_steps == 10842.86, f"Expected 10842.86, got {avg_steps}"
    assert total_steps == 75900, f"Expected 75900, got {total_steps}"
    assert avg_active == 50.71, f"Expected 50.71, got {avg_active}"
    assert total_active == 355, f"Expected 355, got {total_active}"
    print("  [PASS] Activity Analytics calculations verified.")

def test_experiment_analytics(conn):
    print("\n--- [TEST GROUP 6: EXPERIMENT ANALYTICS] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # Experiment 1: Alex - Target: SLEEP_HOURS
    cursor.execute("SELECT id, title, target_metric, before_start_date, before_end_date, during_start_date, during_end_date FROM experiments WHERE id = 1")
    exp = cursor.fetchone()
    exp_id, title, metric, b_start, b_end, d_start, d_end = exp
    print(f"Experiment 1: '{title}', Metric = {metric}")

    cursor.execute("SELECT sleep_hours FROM health_data WHERE user_id = 1 AND record_date BETWEEN ? AND ?", (b_start, b_end))
    before_vals = [r[0] for r in cursor.fetchall()]
    cursor.execute("SELECT sleep_hours FROM health_data WHERE user_id = 1 AND record_date BETWEEN ? AND ?", (d_start, d_end))
    during_vals = [r[0] for r in cursor.fetchall()]

    before_avg = calc.mean(before_vals)
    during_avg = calc.mean(during_vals)
    abs_change = calc.safe_absolute_change(before_avg, during_avg)
    pct_change = calc.safe_percentage_change(before_avg, during_avg)

    # Descriptive summary check
    has_sufficient = len(before_vals) >= 1 and len(during_vals) >= 1
    direction = "INCREASE" if abs_change > 0.01 else "DECREASE"

    print(f"  Before Avg = {before_avg} hrs ({len(before_vals)} records)")
    print(f"  During Avg = {during_avg} hrs ({len(during_vals)} records)")
    print(f"  Absolute Change = +{abs_change} hrs")
    print(f"  Percentage Change = +{pct_change}%")
    print(f"  Direction = {direction}, Sufficient Data = {has_sufficient}")

    assert before_avg == 6.16
    assert during_avg == 7.74
    assert abs_change == 1.58
    assert pct_change == 25.65
    assert has_sufficient is True
    assert direction == "INCREASE"
    print("  [PASS] Experiment Analytics verified.")

def test_edge_cases(conn):
    print("\n--- [TEST GROUP 7: EDGE CASES & DATA HANDLING] ---")
    cursor = conn.cursor()
    calc = AnalyticsCalculationHelperPy()

    # 1. User 3 (Jordan) - empty logs, no health data
    cursor.execute("SELECT id FROM habits WHERE user_id = 3")
    habits = cursor.fetchall()
    cursor.execute("SELECT id FROM habit_logs WHERE user_id = 3")
    logs = cursor.fetchall()
    cursor.execute("SELECT id FROM health_data WHERE user_id = 3")
    health = cursor.fetchall()

    print(f"User 3: Habits = {len(habits)}, Logs = {len(logs)}, Health Records = {len(health)}")
    assert len(habits) == 1
    assert len(logs) == 0
    assert len(health) == 0

    # Ensure analytics helper handles empty list safely
    assert calc.mean([]) is None
    assert calc.min_val([]) is None
    assert calc.max_val([]) is None
    assert calc.determine_trend([]) == "INSUFFICIENT_DATA"
    print("  -> Empty records return None/INSUFFICIENT_DATA without crashing [OK]")

    # 2. Division by zero baseline protection
    zero_pct = calc.safe_percentage_change(0.0, 10.0)
    print(f"  -> Percentage change with 0.0 baseline: {zero_pct} (Safe None protection) [OK]")
    assert zero_pct is None

    zero_to_zero = calc.safe_percentage_change(0.0, 0.0)
    print(f"  -> Percentage change from 0.0 to 0.0: {zero_to_zero}% [OK]")
    assert zero_to_zero == 0.0

    # 3. Single record trend
    single_trend = calc.determine_trend([7.5])
    print(f"  -> Single record trend: {single_trend} [OK]")
    assert single_trend == "INSUFFICIENT_DATA"

    # 4. Null list elements
    mixed_list = [5.0, None, 7.0, None, 9.0]
    mixed_avg = calc.mean(mixed_list)
    print(f"  -> Mean with embedded nulls [5.0, None, 7.0, None, 9.0]: {mixed_avg} [OK]")
    assert mixed_avg == 7.00

    print("  [PASS] All Edge Cases and Zero Protection verified.")

def main():
    print("=" * 70)
    print("HABITLOOP ANALYTICS ENGINE TEST SUITE")
    print("=" * 70)

    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    for stmt in build_sqlite_schema():
        cursor.execute(stmt)
    conn.commit()

    load_seed_data(conn)

    test_habit_analytics(conn)
    test_sleep_analytics(conn)
    test_mood_analytics(conn)
    test_screentime_analytics(conn)
    test_activity_analytics(conn)
    test_experiment_analytics(conn)
    test_edge_cases(conn)

    conn.close()
    print("\n" + "=" * 70)
    print("ALL 7 ANALYTICS TEST GROUPS PASSED WITH 100% SUCCESS RATE!")
    print("=" * 70)

if __name__ == '__main__':
    main()
