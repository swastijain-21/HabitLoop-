import sqlparse
import re

with open('database/seed.sql', 'r', encoding='utf-8') as f:
    text = f.read()

statements = sqlparse.split(text)
for stmt in statements:
    stmt = stmt.strip()
    if not stmt or stmt.upper().startswith('USE'):
        continue
    # Strip ON DUPLICATE KEY UPDATE ...
    stmt_clean = re.sub(r'ON\s+DUPLICATE\s+KEY\s+UPDATE.*$', '', stmt, flags=re.IGNORECASE | re.DOTALL).strip()
    # Strip comments
    lines = [l for l in stmt_clean.split('\n') if not l.strip().startswith('--')]
    stmt_clean = '\n'.join(lines)
    
    m = re.match(r'INSERT\s+INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*(.*)', stmt_clean, re.DOTALL | re.IGNORECASE)
    if m:
        table = m.group(1)
        cols = [c.strip() for c in m.group(2).split(',')]
        values_part = m.group(3).strip()
        print(f"Statement for {table}: {len(cols)} cols")
        # count opening parentheses at depth 1
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
        print(f"  -> Extracted {len(rows)} rows for {table}")
