# QRABS Project

QRABS is an application designed to optimize absence management using QR codes and facial recognition technology. It replaces traditional, manual methods with a fast, accurate, and efficient system. QRABS allows for quick and precise recording of absences, ensuring smooth and effective management.

## Installation Guide

### Prerequisites
Before you begin, make sure you have the following software installed on your machine:

1. **Java Development Kit (JDK) 17**
   - Download: Oracle JDK 17

2. **Node.js 20.10 (LTS)**
   - Download: Node.js 20.10.0
   - Install Yarn 1.22.22: `npm install --global yarn`

3. **Python 3.8.1**
   - Download: Python 3.8.1

### Frontend Installation
1. Open a command line terminal.
2. Navigate to the frontend project directory.
3. Run the following commands:
```
  yarn install
  yarn start
```

4. Access the frontend interface via http://localhost:3000/QRABS (default port: 3000).

### Facial Detection System Installation
1. Install Necessary Libraries:
- Open a command line terminal.
- Navigate to the `facial_detection` directory.
- Execute the following commands:
  ```
  pip install cmake
  pip install boost
  pip install "./dlib/dlib-19.22.99-cp38-cp38-win_amd64.whl"
  pip install -r requirements.txt
  ```
2. Run the facial recognition script:
```
  python Face-recognition.py
```
### Database Setup

1. Create a MySQL relational database.
2. Modify the parameters `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` in the `application.properties` file located in the `backend/src/main/resources` folder.

### Backend Installation
1. Open your IDE (IntelliJ IDEA or Eclipse).
2. For IntelliJ IDEA:
- Right-click on the project in the project explorer.
- Select Maven > Reload Project.
3. For Eclipse:
- Right-click on the project in the project explorer.
- Select Maven > Update Project.
4. Start the backend application using your IDE's configurations.

### URL Configuration
To test the application locally, modify the following IP addresses in the respective files:

- **Frontend** (`/frontend/.env`):
- `REACT_APP_SPRING_BASE_URL=http://192.168.1.106:8080` (machine IP in the network with the backend port)
- `REACT_APP_FLASK_BASE_URL=http://localhost:5010` (default Flask port 5010)

- **Backend** (`backend/.env`):
- `flask_url=http://localhost:5010` (backend port)

- **Facial Recognition** (`facial_recognition/.env`):
- `backendUrl=192.168.1.106:8080` (machine IP in the network and backend port)
