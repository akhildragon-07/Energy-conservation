import sqlite3
import os

db_path = "sql_app.db"

if os.path.exists(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(panel_reports)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if "row" not in columns:
            print("Adding 'row' column...")
            cursor.execute("ALTER TABLE panel_reports ADD COLUMN row INTEGER")
            
        if "column" not in columns:
            print("Adding 'column' column...")
            cursor.execute("ALTER TABLE panel_reports ADD COLUMN column INTEGER")
            
        conn.commit()
        conn.close()
        print("Database migration successful.")
    except Exception as e:
        print(f"Migration failed: {e}")
else:
    print("No database file found to migrate.")
