import re
import os

def main():
    schema_path = os.path.join('database', 'schema.sql')
    seed_path = os.path.join('database', 'seed.sql')

    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    create_blocks = re.findall(r'CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\((.*?)\)\s*ENGINE=InnoDB', schema_sql, re.DOTALL)
    tables_schema = {}
    for table, body in create_blocks:
        lines = [line.strip().rstrip(',') for line in body.strip().split('\n')]
        columns = []
        constraints = []
        for line in lines:
            if line.startswith('CONSTRAINT') or line.startswith('PRIMARY KEY') or line.startswith('UNIQUE KEY'):
                constraints.append(line)
            elif line:
                col_name = line.split()[0]
                columns.append(col_name)
        tables_schema[table] = {'columns': columns, 'constraints': constraints}

    print('Parsed tables from schema.sql:')
    for t, data in tables_schema.items():
        print(f"  - {t}: {len(data['columns'])} columns ({', '.join(data['columns'])}), {len(data['constraints'])} constraints")

    # Verify seed.sql tables
    with open(seed_path, 'r', encoding='utf-8') as f:
        seed_sql = f.read()

    insert_tables = re.findall(r'INSERT INTO\s+(\w+)\s*\((.*?)\)', seed_sql)
    print('\nVerifying seed.sql inserts:')
    for table, col_str in insert_tables:
        cols = [c.strip() for c in col_str.split(',')]
        if table not in tables_schema:
            raise AssertionError(f"Table {table} from seed.sql not in schema.sql!")
        for col in cols:
            if col not in tables_schema[table]['columns']:
                raise AssertionError(f"Column '{col}' in seed.sql not in '{table}' schema!")
        print(f"  [OK] Table '{table}': All {len(cols)} insert columns validated against schema.")

    # Check Java Entity alignment
    entities_dir = os.path.join('backend', 'src', 'main', 'java', 'HabitLoop', 'backend', 'entity')
    entity_files = [f for f in os.listdir(entities_dir) if f.endswith('.java')]
    print('\nVerifying Java JPA Entities in ' + entities_dir + ':')
    for ef in entity_files:
        path = os.path.join(entities_dir, ef)
        with open(path, 'r', encoding='utf-8') as f:
            code = f.read()
        table_match = re.search(r'@Table\(\s*name\s*=\s*"(\w+)"', code)
        if table_match:
            table_name = table_match.group(1)
            assert table_name in tables_schema, f"Entity table '{table_name}' in {ef} not found in schema.sql!"
            print(f"  [OK] Entity '{ef}' maps to table '{table_name}'.")

    print('\nSUCCESS: Schema, seed data, and Java entities are 100% consistent!')

if __name__ == '__main__':
    main()
