import sqlite3
import psycopg2
import csv
import os

def export_sqlite_to_csv():
    db_path = os.path.join('backend', 'internal', 'db', 'crawler.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM results")
    with open('results.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'url', 'title', 'html_version', 'h1_count', 'h2_count', 'h3_count', 'h4_count', 'h5_count', 'h6_count', 'internal_links', 'external_links', 'broken_links', 'has_login_form', 'status'])
        writer.writerows(cursor.fetchall())
    cursor.close()
    conn.close()

def import_csv_to_postgres():
    conn = psycopg2.connect(dbname='crawler_db', user='postgres', password='password', host='localhost')
    cursor = conn.cursor()
    with open('results.csv', 'r', encoding='utf-8') as f:
        cursor.copy_expert("COPY results (id, url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, internal_links, external_links, broken_links, has_login_form, status) FROM STDIN WITH CSV HEADER", f)
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    export_sqlite_to_csv()
    import_csv_to_postgres()