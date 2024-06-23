import sqlite3

# Function to delete all data from the database
def delete_all_data_from_db(db_name):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()

    c.execute("DELETE FROM Encodings")
    conn.commit()

    conn.close()
    print("All data deleted from the database.")

# SQLite database name
db_name = 'face_encodings.db'

# Delete all data from the database
delete_all_data_from_db(db_name)
