import sqlite3
import numpy as np

# Function to retrieve encodings and labels from SQLite database
def retrieve_encodings_from_db(db_name):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()

    c.execute("SELECT label, encoding FROM Encodings")
    rows = c.fetchall()

    labels = []
    encodings = []

    for row in rows:
        labels.append(row[0])
        encoding_bytes = row[1]
        encoding = np.frombuffer(encoding_bytes, dtype=np.float64)
        encodings.append(encoding)

    conn.close()

    return labels, encodings

# Function to display face encoding data in command line
def display_face_encoding_data(labels, encodings):
    print("Face Encoding Data:")
    for label, encoding in zip(labels, encodings):
        print("Label:", label)
        print("Encoding:", encoding)
        print("---------------------")

# SQLite database name
db_name = 'face_encodings.db'

# Retrieve encodings and labels from database
labels, encodings = retrieve_encodings_from_db(db_name)

# Display face encoding data
display_face_encoding_data(labels, encodings)
