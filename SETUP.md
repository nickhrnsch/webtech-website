# Setup Anleitung - Webtech Website mit Login

## Backend Setup

1. **Virtual Environment erstellen:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

2. **Dependencies installieren:**
```bash
pip install -r requirements.txt
```

3. **Backend starten:**
```bash
uvicorn app.main:app --reload
```

Das Backend läuft dann auf `http://localhost:8000`
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

1. **Dependencies installieren (falls noch nicht geschehen):**
```bash
cd frontend
npm install
```

2. **Frontend starten:**
```bash
npm run dev
```

Das Frontend läuft dann auf `http://localhost:5173`

## Environment Variables (Optional)

Im `backend/` Ordner eine `.env` Datei erstellen:
```env
DATABASE_URL=sqlite:///./webtech.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Erste Schritte

1. Backend und Frontend starten
2. Im Frontend auf "Registrieren" klicken
3. Neuen Account erstellen
4. Automatisch eingeloggt werden
5. Profil in der Sidebar bearbeiten - Änderungen werden gespeichert!

## Features

- ✅ User Registrierung
- ✅ Login/Logout
- ✅ JWT Token Authentication
- ✅ Profil bearbeiten (Name, Email)
- ✅ Persistente Speicherung in SQLite Datenbank
- ✅ Auto-Login bei Page Reload (wenn Token noch gültig)
- ✅ Protected Routes

## API Endpoints

- `POST /api/auth/register` - User registrieren
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Aktuellen User abrufen
- `GET /api/users/profile` - Profil abrufen
- `PUT /api/users/profile` - Profil aktualisieren
