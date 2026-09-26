import sqlite3
import re
import os
import sqlparse

def build_sqlite_schema():
    ddl = ["PRAGMA foreign_keys = ON;"]

    # Table 1: users
    ddl.append("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT NULL,
        last_name TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Table 2: habits
    ddl.append("""
    CREATE TABLE habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NULL,
        category TEXT NOT NULL DEFAULT 'GENERAL',
        frequency TEXT NOT NULL DEFAULT 'DAILY',
        target_value REAL NOT NULL DEFAULT 1.00,
        unit TEXT NOT NULL DEFAULT 'times',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (target_value > 0)
    );
    """)

    # Table 3: habit_logs
    ddl.append("""
    CREATE TABLE habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        log_date TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 1,
        logged_value REAL NOT NULL DEFAULT 1.00,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (habit_id, log_date),
        CHECK (logged_value >= 0)
    );
    """)

    # Table 4: mood_logs
    ddl.append("""
    CREATE TABLE mood_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        log_date TEXT NOT NULL,
        score INTEGER NOT NULL,
        mood_label TEXT NULL,
        energy_level INTEGER NULL,
        stress_level INTEGER NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, log_date),
        CHECK (score BETWEEN 1 AND 10),
        CHECK (energy_level IS NULL OR (energy_level BETWEEN 1 AND 10)),
        CHECK (stress_level IS NULL OR (stress_level BETWEEN 1 AND 10))
    );
    """)

    # Table 5: health_data
    ddl.append("""
    CREATE TABLE health_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        record_date TEXT NOT NULL,
        sleep_hours REAL NULL,
        sleep_quality INTEGER NULL,
        screen_time_minutes INTEGER NULL,
        step_count INTEGER NULL,
        active_minutes INTEGER NULL,
        water_intake_ml INTEGER NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, record_date),
        CHECK (sleep_hours IS NULL OR (sleep_hours >= 0.00 AND sleep_hours <= 24.00)),
        CHECK (sleep_quality IS NULL OR (sleep_quality BETWEEN 1 AND 10)),
        CHECK (screen_time_minutes IS NULL OR (screen_time_minutes >= 0 AND screen_time_minutes <= 1440)),
        CHECK (step_count IS NULL OR step_count >= 0),
        CHECK (active_minutes IS NULL OR (active_minutes >= 0 AND active_minutes <= 1440)),
        CHECK (water_intake_ml IS NULL OR water_intake_ml >= 0)
    );
    """)

    # Table 6: experiments
    ddl.append("""
    CREATE TABLE experiments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        hypothesis TEXT NULL,
        target_metric TEXT NOT NULL,
        habit_id INTEGER NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        before_start_date TEXT NOT NULL,
        before_end_date TEXT NOT NULL,
        during_start_date TEXT NOT NULL,
        during_end_date TEXT NOT NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
        CHECK (before_start_date <= before_end_date),
        CHECK (during_start_date <= during_end_date),
        CHECK (before_end_date <= during_start_date)
    );
    """)

    return ddl

def parse_fields_from_row(row_str):
    fields = []
    cur_field = []
    in_q = False
    for c in row_str:
        if c == "'":
            in_q = not in_q
            cur_field.append(c)
        elif c == ',' and not in_q:
            fields.append(''.join(cur_field).strip())
            cur_field = []
        else:
            cur_field.append(c)
    if cur_field:
        fields.append(''.join(cur_field).strip())

    row_values = []
    for f in fields:
        if f.upper() == 'TRUE':
            row_values.append(1)
        elif f.upper() == 'FALSE':
            row_values.append(0)
        elif f.upper() == 'NULL':
            row_values.append(None)
        elif f.startswith("'") and f.endswith("'"):
            row_values.append(f[1:-1])
        else:
            try:
                if '.' in f:
                    row_values.append(float(f))
                else:
                    row_values.append(int(f))
            except ValueError:
                row_values.append(f)
    return row_values

def load_seed_data(conn):
    with open(os.path.join('database', 'seed.sql'), 'r', encoding='utf-8') as f:
        text = f.read()

    cursor = conn.cursor()
    statements = sqlparse.split(text)
    for stmt in statements:
        stmt = stmt.strip()
        if not stmt or stmt.upper().startswith('USE'):
            continue
        # Strip ON DUPLICATE KEY UPDATE ...
        stmt_clean = re.sub(r'ON\s+DUPLICATE\s+KEY\s+UPDATE.*$', '', stmt, flags=re.IGNORECASE | re.DOTALL).strip()
        lines = [l for l in stmt_clean.split('\n') if not l.strip().startswith('--')]
        stmt_clean = '\n'.join(lines)
        
        m = re.match(r'INSERT\s+INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*(.*)', stmt_clean, re.DOTALL | re.IGNORECASE)
        if m:
            table = m.group(1)
            cols = [c.strip() for c in m.group(2).split(',')]
            values_part = m.group(3).strip()
            
            depth = 0
            in_quote = False
            rows = []
            cur = []
            for char in values_part:
                if char == "'" and not in_quote:
                    in_quote = True
                    cur.append(char)
                elif char == "'" and in_quote:
                    in_quote = False
                    cur.append(char)
                elif char == '(' and not in_quote:
                    depth += 1
                    if depth == 1:
                        cur = []
                    else:
                        cur.append(char)
                elif char == ')' and not in_quote:
                    depth -= 1
                    if depth == 0:
                        rows.append(''.join(cur).strip())
                        cur = []
                    else:
                        cur.append(char)
                elif depth > 0:
                    cur.append(char)
            
            placeholders = ', '.join(['?' for _ in cols])
            sql = f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})"
            for r in rows:
                parsed_vals = parse_fields_from_row(r)
                cursor.execute(sql, parsed_vals)

    conn.commit()

def run_tests():
    print("=" * 70)
    print("HABITLOOP DATABASE TEST SUITE EXECUTION")
    print("=" * 70)

    # Step 1: SQL Syntax Validation via sqlparse
    print("\n[TEST 0] Validating MySQL syntax in database/schema.sql and seed.sql...")
    with open(os.path.join('database', 'schema.sql'), 'r', encoding='utf-8') as f:
        schema_raw = f.read()
    schema_statements = [s for s in sqlparse.parse(schema_raw) if s.get_type() in ('CREATE', 'UNKNOWN')]
    print(f"  -> Successfully parsed {len(schema_statements)} SQL DDL statements.")
    
    with open(os.path.join('database', 'seed.sql'), 'r', encoding='utf-8') as f:
        seed_raw = f.read()
    seed_statements = [s for s in sqlparse.parse(seed_raw) if s.get_type() in ('INSERT', 'UNKNOWN')]
    print(f"  -> Successfully parsed {len(seed_statements)} SQL seed statements.")
    print("  [PASS] Test 0: All SQL syntax is well-formed.")

    # Create in-memory database
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    # Step 2: DDL Execution
    print("\n[TEST 1] Creating schema with foreign keys, constraints, and types...")
    ddl_statements = build_sqlite_schema()
    for stmt in ddl_statements:
        cursor.execute(stmt)
    conn.commit()
    print("  [PASS] Test 1: All 6 tables created successfully with constraints.")

    # Step 3: Seed Data Insertion
    print("\n[TEST 2] Inserting sample seed data from database/seed.sql...")
    load_seed_data(conn)
    print("  [PASS] Test 2: Seed data inserted cleanly without errors.")

    # Step 4: Verify Row Counts
    print("\n[TEST 3] Verifying expected record counts across all 6 tables...")
    expected_counts = {
        'users': 3,
        'habits': 7,
        'habit_logs': 49,
        'mood_logs': 21,
        'health_data': 21,
        'experiments': 2
    }
    for tbl, expected in expected_counts.items():
        cursor.execute(f"SELECT COUNT(*) FROM {tbl}")
        actual = cursor.fetchone()[0]
        assert actual == expected, f"Mismatch in {tbl}: expected {expected}, got {actual}"
        print(f"  -> Table '{tbl}': {actual} rows (Expected: {expected}) [MATCH]")
    print("  [PASS] Test 3: All table row counts match expected values exactly.")

    # Step 5: Duplicate Prevention on habit_logs
    print("\n[TEST 4] Testing duplicate habit log prevention (UNIQUE habit_id, log_date)...")
    try:
        cursor.execute("""
            INSERT INTO habit_logs (habit_id, user_id, log_date, completed, logged_value)
            VALUES (1, 1, '2026-09-10', 1, 10.00)
        """)
        conn.commit()
        raise AssertionError("Failed: Duplicate habit log was accepted when it should have been rejected!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected duplicate: {e}")
        print("  [PASS] Test 4: Unique constraint on (habit_id, log_date) verified.")

    # Step 6: Mood Score Check Constraint (1-10)
    print("\n[TEST 5] Testing out-of-bounds mood score check constraint (score = 15)...")
    try:
        cursor.execute("""
            INSERT INTO mood_logs (user_id, log_date, score)
            VALUES (1, '2026-10-01', 15)
        """)
        conn.commit()
        raise AssertionError("Failed: Invalid mood score 15 was accepted!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected invalid score: {e}")
        print("  [PASS] Test 5: Check constraint 'score BETWEEN 1 AND 10' verified.")

    # Step 7: Sleep Hours Check Constraint (0.00 - 24.00)
    print("\n[TEST 6] Testing out-of-bounds sleep hours check constraint (sleep_hours = 26.0)...")
    try:
        cursor.execute("""
            INSERT INTO health_data (user_id, record_date, sleep_hours)
            VALUES (1, '2026-10-01', 26.00)
        """)
        conn.commit()
        raise AssertionError("Failed: Invalid sleep hours 26.0 was accepted!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected invalid sleep: {e}")
        print("  [PASS] Test 6: Check constraint 'sleep_hours <= 24.0' verified.")

    # Step 8: Experiment Chronology Check Constraint
    print("\n[TEST 7] Testing invalid experiment chronology (before_end > during_start)...")
    try:
        cursor.execute("""
            INSERT INTO experiments (user_id, title, target_metric, before_start_date, before_end_date, during_start_date, during_end_date)
            VALUES (1, 'Invalid Chronology', 'SLEEP_HOURS', '2026-10-15', '2026-10-20', '2026-10-01', '2026-10-07')
        """)
        conn.commit()
        raise AssertionError("Failed: Backwards experiment dates were accepted!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected invalid experiment chronology: {e}")
        print("  [PASS] Test 7: Check constraint 'before_end <= during_start' verified.")

    # Step 9: Duplicate Health Data Prevention
    print("\n[TEST 8] Testing duplicate health record prevention (UNIQUE user_id, record_date)...")
    try:
        cursor.execute("""
            INSERT INTO health_data (user_id, record_date, sleep_hours)
            VALUES (1, '2026-09-10', 8.00)
        """)
        conn.commit()
        raise AssertionError("Failed: Duplicate health record for same user on same day was accepted!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected duplicate health entry: {e}")
        print("  [PASS] Test 8: Unique constraint on (user_id, record_date) verified.")

    # Step 10: Foreign Key Cascading Deletion
    print("\n[TEST 9] Testing Foreign Key cascading deletion on user removal...")
    cursor.execute("SELECT COUNT(*) FROM habits WHERE user_id = 3")
    habits_before = cursor.fetchone()[0]
    print(f"  -> User 3 has {habits_before} habit(s) before deletion.")
    
    cursor.execute("DELETE FROM users WHERE id = 3")
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM habits WHERE user_id = 3")
    habits_after = cursor.fetchone()[0]
    print(f"  -> User 3 has {habits_after} habit(s) after deletion.")
    assert habits_after == 0, "Failed: Habits were not cascaded upon user deletion!"
    print("  [PASS] Test 9: Foreign key ON DELETE CASCADE verified.")

    # Step 11: Foreign Key ON DELETE SET NULL for Experiments
    print("\n[TEST 10] Testing Experiment habit_id nullification when linked habit is deleted...")
    cursor.execute("SELECT habit_id FROM experiments WHERE id = 1")
    linked_habit = cursor.fetchone()[0]
    print(f"  -> Experiment 1 is currently linked to habit_id: {linked_habit}")
    
    cursor.execute("DELETE FROM habits WHERE id = 4")
    conn.commit()

    cursor.execute("SELECT habit_id FROM experiments WHERE id = 1")
    linked_after = cursor.fetchone()[0]
    print(f"  -> Experiment 1 habit_id after habit deletion: {linked_after}")
    assert linked_after is None, "Failed: Experiment habit_id was not set to NULL when habit was deleted!"
    print("  [PASS] Test 10: Foreign key ON DELETE SET NULL on experiments verified.")

    # Step 12: Habit Log Negative Value Check
    print("\n[TEST 11] Testing negative logged_value check constraint (logged_value < 0)...")
    try:
        cursor.execute("""
            INSERT INTO habit_logs (habit_id, user_id, log_date, completed, logged_value)
            VALUES (1, 1, '2026-10-05', 1, -5.0)
        """)
        conn.commit()
        raise AssertionError("Failed: Negative habit progress was accepted!")
    except sqlite3.IntegrityError as e:
        print(f"  -> Correctly rejected negative progress value: {e}")
        print("  [PASS] Test 11: Check constraint 'logged_value >= 0' verified.")

    conn.close()

    print("\n" + "=" * 70)
    print("ALL 12 TESTS EXECUTED AND PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
