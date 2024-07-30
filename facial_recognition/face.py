from flask import Flask, Response, request, jsonify
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
import cv2

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
        logging.error(f"Error retrieving encodings from database: {e}")
        return [], []

# Initialize database and create table if not exists
DATABASE_URL = os.getenv('DATABASE_URL', 'face_encodings.db')

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

# Function to capture frame and detect faces
def capture_and_detect_faces(camera_index=1, process_interval=5):
    cap = cv2.VideoCapture(camera_index)  # Open specified camera

    # Set resolution to reduce load
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    if not cap.isOpened():
        logging.error("Cannot open camera")
        return None, "Cannot open camera"

    last_processed_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            logging.error("Failed to capture image")
            break

        current_time = time.time()
        if current_time - last_processed_time >= process_interval:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            yield frame, face_encodings, face_locations
            last_processed_time = current_time

    cap.release()  # Release the camera resource

# Function to draw labels and session information
def draw_labels_on_faces(frame, sessionId, levelId, apogee, face_locations):
    # Define text properties
    font = cv2.FONT_HERSHEY_SIMPLEX
    fontScale = 0.6
    color = (0, 0, 255)  # Red color
    thickness = 1
    y0, dy = 30, 30  # Initial y position and vertical spacing

    # Draw session and level information horizontally at the top of the frame
    info_texts = [
        f"SessionID: {sessionId}",
        f"LevelID: {levelId}"
    ]

    for i, text in enumerate(info_texts):
        y = y0 + i * dy
        cv2.putText(frame, text, (10, y), font, fontScale, color, thickness, cv2.LINE_AA)

    # Draw apogee vertically below the detected face
    for (top, right, bottom, left) in face_locations:
        # Draw rectangle around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        
        # Draw apogee vertically below the detected face
        text_y = bottom + 30
        for i, line in enumerate(apogee.split()):
            cv2.putText(frame, line, (left, text_y + i * 20), font, fontScale, color, thickness, cv2.LINE_AA)

@app.route('/api', methods=['POST'])
def receive_request():
    sessionId = request.json['sessionId']
    group = request.json['group']

    for frame, face_encodings, face_locations in capture_and_detect_faces(camera_index=1, process_interval=5):  # Change camera_index if needed
        if face_encodings:
            known_face_labels, known_face_encodings = retrieve_encodings_from_db(DATABASE_URL)
            matches = face_recognition.compare_faces(known_face_encodings, face_encodings[0])
            face_distances = face_recognition.face_distance(known_face_encodings, face_encodings[0])
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                name = known_face_labels[best_match_index]
                parts = name.split('-')
                apogee = parts[0]
                levelId = parts[1].split('.')[0]
                isPresent = "Yes"  # Set this based on your logic

                BackendUrl = os.getenv('BackendUrl')
                springBootEndpoint = f"http://{BackendUrl}/api/absence/forprofesseur/{sessionId}/{levelId}/{group}?Apogee={apogee}"
                response = requests.post(springBootEndpoint)

                draw_labels_on_faces(frame, sessionId, levelId, apogee, face_locations)
                cv2.imshow('Face Recognition', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

    cv2.destroyAllWindows()
    return jsonify({"message": "No matching face found"}), 404

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

if __name__ == '__main__':
    init_db()
    app.run(port=5090, debug=True)



# from flask import Flask, Response, request, jsonify
# import os
# import base64
# import time
# from flask_cors import CORS
# import face_recognition
# import sqlite3
# import numpy as np
# import requests
# import logging
# from dotenv import load_dotenv
# import cv2

# app = Flask(__name__)
# CORS(app)
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # Function to retrieve encodings and labels from SQLite database
# def retrieve_encodings_from_db(db_name):
#     try:
#         conn = sqlite3.connect(db_name)
#         c = conn.cursor()

#         c.execute("SELECT label, encoding FROM Encodings")
#         rows = c.fetchall()

#         labels = []
#         encodings = []

#         for row in rows:
#             labels.append(row[0])
#             encoding_bytes = row[1]
#             encoding = np.frombuffer(encoding_bytes, dtype=np.float64)
#             encodings.append(encoding)

#         conn.close()

#         return labels, encodings
#     except Exception as e:
#         logging.error(f"Error retrieving encodings from database: {e}")
#         return [], []

# # Initialize database and create table if not exists
# DATABASE_URL = os.getenv('DATABASE_URL', 'face_encodings.db')

# def init_db():
#     try:
#         with sqlite3.connect(DATABASE_URL) as conn:
#             c = conn.cursor()
#             c.execute('''CREATE TABLE IF NOT EXISTS Encodings
#                          (id INTEGER PRIMARY KEY, label TEXT, encoding BLOB)''')
#             conn.commit()
#         logging.info("Database initialized successfully.")
#     except sqlite3.Error as e:
#         logging.error(f"Failed to initialize database: {e}")

# # Function to capture frame and detect faces
# def capture_and_detect_faces(camera_index=1):  # Change camera_index if needed
#     cap = cv2.VideoCapture(camera_index)  # Open specified camera

#     if not cap.isOpened():
#         logging.error("Cannot open camera")
#         return None, "Cannot open camera"

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             logging.error("Failed to capture image")
#             break

#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         face_locations = face_recognition.face_locations(rgb_frame)
#         face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

#         yield frame, face_encodings, face_locations

#     cap.release()  # Release the camera resource

# # Function to draw labels on detected faces
# def draw_labels_on_faces(frame, face_locations, labels):
#     for (top, right, bottom, left), label in zip(face_locations, labels):
#         apogee = label.split('-')[0]  # Extract only the apogee
#         cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#         cv2.putText(frame, apogee, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

# @app.route('/api', methods=['POST'])
# def receive_request():
#     sessionId = request.json['sessionId']
#     group = request.json['group']

#     for frame, face_encodings, face_locations in capture_and_detect_faces(camera_index=1):  # Change camera_index if needed
#         if face_encodings:
#             known_face_labels, known_face_encodings = retrieve_encodings_from_db(DATABASE_URL)
#             matches = face_recognition.compare_faces(known_face_encodings, face_encodings[0])
#             face_distances = face_recognition.face_distance(known_face_encodings, face_encodings[0])
#             best_match_index = np.argmin(face_distances)

#             if matches[best_match_index]:
#                 name = known_face_labels[best_match_index]
#                 parts = name.split('-')
#                 apogee = parts[0]
#                 levelId = parts[1].split('.')[0]
#                 BackendUrl = os.getenv('BackendUrl')
#                 springBootEndpoint = f"http://{BackendUrl}/api/absence/forprofesseur/{sessionId}/{levelId}/{group}?Apogee={apogee}"
#                 response = requests.post(springBootEndpoint)
#                 draw_labels_on_faces(frame, face_locations, [name])
#                 cv2.imshow('Face Recognition', frame)
#                 if cv2.waitKey(1) & 0xFF == ord('q'):
#                     break

#     cv2.destroyAllWindows()
#     return jsonify({"message": "No matching face found"}), 404

# @app.route('/prestart-recognition', methods=['POST', 'OPTIONS'])
# def options():
#     if request.method == 'OPTIONS':
#         response = jsonify({"message": "OPTIONS request received"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
#         response.headers.add("Access-Control-Allow-Headers", "Content-Type")
#         return response
#     else:
#         return jsonify({"message": "POST request received"})

# if __name__ == '__main__':
#     init_db()
#     app.run(port=5010, debug=True)
