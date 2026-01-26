# Webtech Website

Ein Urlaubsplaner-Dashboard von Marius, Leander, Paul und Nicklas.

## Projektübersicht

Diese Webapplikation ist ein modernes Dashboard mit verschiedenen Widgets und Features. Sie besteht aus einem React-Frontend und einem FastAPI-Backend mit SQLite-Datenbank.

## Tech Stack

**Frontend:**
- React 18 mit Vite
- Material UI (MUI) Komponenten
- Day.js für Datums-Handling
- Axios für API-Kommunikation

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite Datenbank
- JWT Authentication

## Features

### Authentifizierung

- **Benutzerregistrierung** - Neue Accounts können erstellt werden
- **Login/Logout** - Sichere Anmeldung mit Benutzername und Passwort
- **JWT Token Authentication** - Sichere API-Kommunikation mit Access Tokens
- **Auto-Login** - Bei Page-Reload bleibt der User eingeloggt (solange Token gültig)
- **Protected Routes** - Nur eingeloggte User können das Dashboard sehen

### Benutzerprofil

- **Profil anzeigen** - Benutzerdaten in der Sidebar einsehen
- **Profil bearbeiten** - Name, E-Mail und Abteilung können geändert werden
- **Avatar-Generierung** - Automatische Avatare basierend auf dem Benutzernamen
- **Persistente Speicherung** - Alle Änderungen werden in der Datenbank gespeichert

### Kalender

- **Interaktiver Kalender** - Monatsansicht mit deutscher Lokalisierung
- **Tagesnotizen** - Notizen für einzelne Tage erstellen und bearbeiten
- **Textformatierung** - Fett, Kursiv und Unterstrichen für Notizen
- **Urlaubsplanung** - Urlaube mit Start- und Enddatum planen
  - Urlaubsort eingeben
  - Teilnehmer hinzufügen
  - Visuelle Markierung der Urlaubstage im Kalender
- **Wetter-Integration** - Wetterdaten für Urlaubsorte abrufen (Open-Meteo API)
- **Export-Funktionen:**
  - Export zu Google Calendar
  - Download als .ics Datei (kompatibel mit allen Kalender-Apps)
- **Teilen** - Urlaube per URL mit anderen teilen

### Währungsrechner

- **Währungsumrechnung** - Echtzeit-Konvertierung zwischen Währungen
- **Aktuelle Kurse** - Wechselkurse von der EZB (Europäische Zentralbank)
- **Favoriten-System** - Häufig genutzte Währungspaare als Favoriten speichern
- **Swap-Funktion** - Schnelles Tauschen von Quell- und Zielwährung
- **Automatische Konvertierung** - Ergebnis aktualisiert sich bei Eingabe
- **Währungsinfo** - Anzeige von Währungssymbolen und Wechselkurs-Details

### Dashboard Layout

- **Sidebar-Navigation** - Seitliche Navigation mit Icons
- **Widget-System** - Modulare Widgets im Hauptbereich
- **Responsives Design** - Anpassung an verschiedene Bildschirmgrößen

## Installation

### Voraussetzungen

- Node.js (v18 oder höher empfohlen)
- Python 3.8+

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Das Backend läuft auf `http://localhost:8000`
- API Dokumentation: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Das Frontend läuft auf `http://localhost:5173`

## API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/login` | Anmelden |
| GET | `/api/auth/me` | Aktuellen Benutzer abrufen |
| GET | `/api/users/profile` | Profil abrufen |
| PUT | `/api/users/profile` | Profil aktualisieren |
| GET | `/api/users/currency-favorites` | Währungs-Favoriten abrufen |
| PUT | `/api/users/currency-favorites` | Währungs-Favoriten speichern |

## Umgebungsvariablen

Optional kann im `backend/` Ordner eine `.env` Datei erstellt werden:

```env
DATABASE_URL=sqlite:///./webtech.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Projektstruktur

```
webtech-website/
├── backend/
│   ├── app/
│   │   ├── crud/           # Datenbank-Operationen
│   │   ├── routers/        # API-Routen
│   │   ├── auth.py         # JWT-Authentifizierung
│   │   ├── database.py     # Datenbankverbindung
│   │   ├── models.py       # SQLAlchemy Models
│   │   └── schemas.py      # Pydantic Schemas
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Login, Register, ProtectedRoute
│   │   ├── context/        # AuthContext
│   │   ├── Features/       # Kalender, Währungsrechner
│   │   ├── Layout/         # Sidebar, Fenster, Widgets
│   │   └── services/       # API-Services
│   └── package.json
└── README.md
```