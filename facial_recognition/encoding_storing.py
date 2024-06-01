import face_recognition
import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_files():
    files = request.files.getlist('files')
    for file in files:
        encode_and_store_face_in_db(file, "face_encodings.db")
    
    return jsonify({'message': 'Images processed successfully'})

def encode_and_store_face_in_db(image_file, db_name):
    if not image_file.content_type.startswith('image'):
        print("Le fichier '" + image_file.filename + "' n'est pas une image.")
        return

    try:
        image = face_recognition.load_image_file(image_file)
        face_encodings = face_recognition.face_encodings(image)

        if face_encodings:
            face_encoding = face_encodings[0]

            with sqlite3.connect(db_name) as conn:
                c = conn.cursor()
                c.execute('''CREATE TABLE IF NOT EXISTS Encodings
                             (id INTEGER PRIMARY KEY, label TEXT, encoding BLOB)''')
                c.execute("INSERT INTO Encodings (label, encoding) VALUES (?, ?)",
                          (image_file.filename, face_encoding.tobytes()))
                print("Encodage du visage dans '" + image_file.filename + "' stocké dans la base de données.")
        else:
            print("Aucun visage détecté dans '" + image_file.filename + "'.")
    except Exception as e:
        print("Une erreur est survenue : {e}")

if __name__ == '__main__':
    app.run(debug=True)
