# Agentica

## Overview  
Agentica is an agentic AI chat platform powered by large language models, featuring user authentication, profile management, and real-time chat sessions.

## Clone from GitHub  
```bash
git clone https://github.com/NoManNayeem/Agentica.git
cd agentica
```

## Install and Run Locally (Backend & Frontend)

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate       # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Install and Run with Docker Compose
```bash
docker-compose up --build
```

- **Backend**: http://localhost:8000/  
- **Frontend**: http://localhost:3000/

## Screenshots

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
  <img src="./screenshots/screenshot_1.png" alt="Screenshot 1" />
  <img src="./screenshots/screenshot_2.png" alt="Screenshot 2" />
  <img src="./screenshots/screenshot_3.png" alt="Screenshot 3" />
  <img src="./screenshots/screenshot_4.png" alt="Screenshot 4" />
  <img src="./screenshots/screenshot_5.png" alt="Screenshot 5" />
</div>