# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# import face_recognition
# import sqlite3
# import requests
# import random
# import os
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # Variable globale pour contrôler l'état de la reconnaissance
# is_recognizing = True

# # Fonction pour récupérer les encodages et les étiquettes de la base de données SQLite
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
#         print(f"Erreur lors de la récupération des encodages de la base de données : {e}")
#         return [], []

# @app.route('/start-recognition', methods=['POST'])
# def start_recognition():
#     global is_recognizing
#     try:
#         data = request.json
#         sessionId = data['sessionId']
#         levelId = data['levelId']
#         group = data['group']

#         # Initialiser quelques variables
#         process_this_frame = True

#         # Démarrer la capture vidéo
#         video_capture = cv2.VideoCapture(0)

#         # Vérifier si la caméra est ouverte
#         if not video_capture.isOpened():
#             return jsonify({"error": "La caméra n'a pas pu être ouverte."})

#         # Récupérer les encodages de visage connus et les étiquettes de la base de données
#         known_face_labels, known_face_encodings = retrieve_encodings_from_db('face_encodings.db')

#         while is_recognizing:
#             # Saisir une seule image de la vidéo
#             ret, frame = video_capture.read()

#             # Vérifier si la capture vidéo a réussi
#             if not ret:
#                 return jsonify({"error": "Échec de la capture vidéo."})

#             # Traiter une image sur deux pour gagner du temps
#             if process_this_frame:
#                 # Redimensionner l'image de la vidéo pour un traitement plus rapide
#                 small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

#                 # Convertir l'image de BGR (utilisé par OpenCV) en RGB (utilisé par face_recognition)
#                 rgb_small_frame = small_frame[:, :, ::-1]
                
#                 # Trouver tous les visages et encodages de visage dans l'image actuelle
#                 face_locations = face_recognition.face_locations(rgb_small_frame)
#                 face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

#                 face_names = []
#                 for face_encoding in face_encodings:
#                     # Initialiser le nom à Inconnu
#                     name = "Unknown"

#                     # Vérifier si le visage correspond à un visage connu
#                     matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
#                     face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
#                     best_match_index = np.argmin(face_distances)
#                     if matches[best_match_index]:
#                         name = known_face_labels[best_match_index]

#                     face_names.append(name)

#             process_this_frame = not process_this_frame

#             # Afficher les résultats
#             for (top, right, bottom, left), name in zip(face_locations, face_names):
#                 # Agrandir les emplacements des visages car l'image détectée était réduite
#                 top *= 4
#                 right *= 4
#                 bottom *= 4
#                 left *= 4

#                 # Dessiner un cadre autour du visage
#                 cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

#                 # Dessiner une étiquette avec un nom sous le visage
#                 cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
#                 font = cv2.FONT_HERSHEY_DUPLEX
#                 cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

#                 # Si un visage est reconnu, envoyer les résultats au serveur Spring Boot
#                 if name != "Unknown":
#                     # Extraire l'Apogee du nom de l'image (par exemple, '1234.jpg' -> 1234)
#                     apogee, _ = os.path.splitext(name)
#                     apogee = int(apogee)  # Convertir en entier

#                     ip = str(random.randint(0, 255))  # Générer un nombre aléatoire pour l'IP
#                     springBootEndpoint = f"http://localhost:8080/api/absence/scan/{sessionId}/{levelId}/{group}?Apogee={apogee}&ip={ip}"
#                     response = requests.post(springBootEndpoint)
#                     print(response.text)

#             # Afficher l'image résultante
#             cv2.imshow('Video', frame)

#             # Appuyer sur 'q' pour quitter !
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 is_recognizing = False

#         # Libérer la capture vidéo
#         video_capture.release()
#         cv2.destroyAllWindows()

#         return jsonify({"message": "Reconnaissance faciale terminée et données envoyées."})
#     except Exception as e:
#         print(f"Erreur lors de l'exécution de la reconnaissance faciale : {e}")
#         return jsonify({"error": "Une erreur s'est produite lors de l'exécution de la reconnaissance faciale."})

# @app.route('/stop-recognition', methods=['POST'])
# def stop_recognition():
#     global is_recognizing
#     is_recognizing = False
#     return jsonify({"message": "Arrêt de la reconnaissance faciale initié."})

# @app.route('/prestart-recognition', methods=['POST'])
# def options():
#     response = jsonify({"message": "OPTIONS request received"})
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type")
#     return response

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5005)

###########################################################################################

from flask import Flask, request, jsonify
import cv2
import numpy as np
import face_recognition
import sqlite3
import requests
import random
import os
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Fonction pour récupérer les encodages et les étiquettes de la base de données SQLite
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
        print(f"Erreur lors de la récupération des encodages de la base de données : {e}")
        return [], []

def perform_face_recognition(sessionId, levelId, group):
    global is_recognizing
    try:
        process_this_frame = True
        video_capture = cv2.VideoCapture(0)

        if not video_capture.isOpened():
            return {"error": "La caméra n'a pas pu être ouverte."}

        known_face_labels, known_face_encodings = retrieve_encodings_from_db('face_encodings.db')

        while is_recognizing:
            ret, frame = video_capture.read()
            if not ret:
                return {"error": "Échec de la capture vidéo."}

            if process_this_frame:
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgb_small_frame = small_frame[:, :, ::-1]

                face_locations = face_recognition.face_locations(rgb_small_frame)
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                face_names = []
                for face_encoding in face_encodings:
                    name = "Unknown"
                    matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = known_face_labels[best_match_index]

                    face_names.append(name)

            process_this_frame = not process_this_frame

            for (top, right, bottom, left), name in zip(face_locations, face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

                if name != "Unknown":
                    apogee, _ = os.path.splitext(name)
                    apogee = int(apogee)

                    ip = str(random.randint(0, 255))
                    springBootEndpoint = f"http://localhost:8080/api/absence/scan/{sessionId}/{levelId}/{group}?Apogee={apogee}&ip={ip}"
                    response = requests.post(springBootEndpoint)
                    print(response.text)

            cv2.imshow('Video', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                is_recognizing = False
                break

        video_capture.release()
        cv2.destroyAllWindows()

        return {"message": "Reconnaissance faciale terminée et données envoyées."}
    except Exception as e:
        print(f"Erreur lors de l'exécution de la reconnaissance faciale : {e}")
        return {"error": "Une erreur s'est produite lors de l'exécution de la reconnaissance faciale."}

@app.route('/start-recognition', methods=['POST'])
def start_recognition():
    global is_recognizing
    is_recognizing = True  # Reset recognition state
    data = request.json
    sessionId = data['sessionId']
    levelId = data['levelId']
    group = data['group']

    recognition_thread = threading.Thread(target=perform_face_recognition, args=(sessionId, levelId, group))
    recognition_thread.start()

    return jsonify({"message": "Reconnaissance faciale démarrée."})

@app.route('/stop-recognition', methods=['POST'])
def stop_recognition():
    global is_recognizing
    is_recognizing = False
    return jsonify({"message": "Arrêt de la reconnaissance faciale initié."})

@app.route('/prestart-recognition', methods=['POST'])
def options():
    response = jsonify({"message": "OPTIONS request received"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
