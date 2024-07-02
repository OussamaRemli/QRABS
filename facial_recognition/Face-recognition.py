from flask import Flask, request, jsonify
import os
import base64
import time
from flask_cors import CORS
import face_recognition
import sqlite3
import numpy as np
import requests
import logging
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

# Function to retrieve encodings and labels from SQLite database
def retrieve_encodings_from_db(db_name):
    try:
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
    except Exception as e:
        print(f"Error retrieving encodings from database: {e}")
        return [], []

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api', methods=['POST'])
def receive_photo():
    known_face_labels, known_face_encodings = retrieve_encodings_from_db('face_encodings.db')

    data = request.json['data']
    sessionId = request.json['sessionId']
    group = request.json['group']



    # Decode the base64 image
    image_data = base64.b64decode(data.split(',')[1])

    # Secure filename using a timestamp
    filename = f"photo_{int(time.time())}.jpg"

    # Full path to save the image
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Save the image
    with open(filepath, 'wb') as f:
        f.write(image_data)

    # Load the image using face_recognition
    image = face_recognition.load_image_file(filepath)
    face_encodings = face_recognition.face_encodings(image)
    
    if face_encodings:
        print("Face encoding found")  # Debug statement
        matches = face_recognition.compare_faces(known_face_encodings, face_encodings[0])
        face_distances = face_recognition.face_distance(known_face_encodings, face_encodings[0])
        best_match_index = np.argmin(face_distances)
        
        if matches[best_match_index]:
            name = known_face_labels[best_match_index]
            parts = name.split('-')  
            apogee = parts[0]  
            levelId = parts[1].split('.')[0]
            BackendUrl = os.getenv('BackendUrl')
            springBootEndpoint = f"http://{BackendUrl}/api/absence/forprofesseur/{sessionId}/{levelId}/{group}?Apogee={apogee}"
            response = requests.post(springBootEndpoint)

    os.remove(filepath)

    # Response
    response = {"message": "Photo reçue et enregistrée avec succès", "filename": filename}
    return jsonify(response)

@app.route('/prestart-recognition', methods=['POST', 'OPTIONS'])
def options():
    if request.method == 'OPTIONS':
        response = jsonify({"message": "OPTIONS request received"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    else:
        return jsonify({"message": "POST request received"})
    


    # Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load sensitive information from environment variables
DATABASE_URL = os.getenv('DATABASE_URL', 'face_encodings.db')

# Initialize the database and create table if not exists
def init_db():
    try:
        with sqlite3.connect(DATABASE_URL) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS Encodings
                         (id INTEGER PRIMARY KEY, label TEXT, encoding BLOB)''')
            conn.commit()
        logging.info("Database initialized successfully.")
    except sqlite3.Error as e:
        logging.error(f"Failed to initialize database: {e}")

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
    try:
        logging.info(f"Processing file: {image_file.filename}")
        image = face_recognition.load_image_file(image_file)
        face_encodings = face_recognition.face_encodings(image)

        if face_encodings:
            face_encoding = face_encodings[0]
            with sqlite3.connect(DATABASE_URL) as conn:
                c = conn.cursor()
                c.execute("INSERT INTO Encodings (label, encoding) VALUES (?, ?)",
                          (image_file.filename, face_encoding.tobytes()))
                conn.commit()
            logging.info(f"Encodage du visage dans '{image_file.filename}' stocké dans la base de données.")
            return f"Encodage du visage dans '{image_file.filename}' stocké dans la base de données."
        else:
            logging.info(f"Aucun visage détecté dans '{image_file.filename}'.")
            return f"Aucun visage détecté dans '{image_file.filename}'."
    except sqlite3.Error as db_err:
        logging.error(f"Database error: {db_err}")
        raise
    except Exception as e:
        logging.error(f"An error occurred while processing '{image_file.filename}': {e}")
        raise
    
    
if __name__ == '__main__':
    app.run(port=5010, debug=True)





