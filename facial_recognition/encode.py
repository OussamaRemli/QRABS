import face_recognition
import sqlite3
from flask import Flask, request, jsonify
import logging
import os
from waitress import serve

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load sensitive information from environment variables
DATABASE_URL = os.getenv('DATABASE_URL', 'face_encodings.db')

# Initialize the database and create table if not exists
def init_db():
    with sqlite3.connect(DATABASE_URL) as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS Encodings
                     (id INTEGER PRIMARY KEY, label TEXT, encoding BLOB)''')
        conn.commit()
    logging.info("Database initialized successfully.")

@app.route('/process', methods=['POST'])
def process_files():
    files = request.files.getlist('files')
    response_messages = []

    for file in files:
        if not file.content_type.startswith('image'):
            response_messages.append(f"Le fichier '{file.filename}' n'est pas une image.")
            continue

        try:
            message = encode_and_store_face_in_db(file)
            response_messages.append(message)
        except Exception as e:
            logging.error(f"Error processing {file.filename}: {e}")
            response_messages.append(f"Error processing {file.filename}: {str(e)}")

    return jsonify({'messages': response_messages})

def encode_and_store_face_in_db(image_file):
    with sqlite3.connect(DATABASE_URL) as conn:
        c = conn.cursor()
        logging.info(f"Processing file: {image_file.filename}")
        image = face_recognition.load_image_file(image_file)
        face_encodings = face_recognition.face_encodings(image)

        if face_encodings:
            face_encoding = face_encodings[0]
            c.execute("INSERT INTO Encodings (label, encoding) VALUES (?, ?)",
                      (image_file.filename, face_encoding.tobytes()))
            conn.commit()
            logging.info(f"Encodage du visage dans '{image_file.filename}' stocké dans la base de données.")
            return f"Encodage du visage dans '{image_file.filename}' stocké dans la base de données."
        else:
            logging.info(f"Aucun visage détecté dans '{image_file.filename}'.")
            return f"Aucun visage détecté dans '{image_file.filename}'."

if __name__ == '__main__':
    init_db()
    app.run()
