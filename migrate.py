import sqlite3
import csv
import os

# Ensure the database directory exists
db_dir = r'C:\Sridhar\Python\AI_Projects\url_crawler\backend\internal\db'
os.makedirs(db_dir, exist_ok=True)

# Connect to SQLite database
db_path = os.path.join(db_dir, 'crawler.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create results table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT,
        html_version TEXT,
        h1_count INTEGER,
        h2_count INTEGER,
        h3_count INTEGER,
        h4_count INTEGER,
        h5_count INTEGER,
        h6_count INTEGER,
        internal_links INTEGER,
        external_links INTEGER,
        broken_links TEXT,
        has_login_form INTEGER,
        status TEXT,
        UNIQUE(url)
    )
''')

# Import data from MySQL CSV export
csv_path = r'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/results.csv'
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) == 15:
            cursor.execute('''
                INSERT OR IGNORE INTO results (
                    id, url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
                    internal_links, external_links, broken_links, has_login_form, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', row)

conn.commit()
conn.close()