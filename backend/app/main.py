from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from sqlalchemy import text
from app.routers import auth, users, vacations
from app.dependencies import get_current_user
from app.schemas import UserResponse
from app.models import User
from app.crud.user import get_currency_favorites

# Erstelle alle Tabellen
Base.metadata.create_all(bind=engine)

# Lightweight migration: ensure currency_favorites column exists
with engine.connect() as connection:
    try:
        result = connection.execute(text("PRAGMA table_info(users)"))
        columns = [row[1] for row in result.fetchall()]
        if "currency_favorites" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN currency_favorites TEXT"))
            connection.commit()
    except Exception:
        pass

# Lightweight migration: ensure vacation extension columns exist (title, notes, accommodation, vacation_type, link)
with engine.connect() as conn:
    try:
        res = conn.execute(text("PRAGMA table_info(vacations)"))
        vac_cols = [row[1] for row in res.fetchall()]
        for col, ctype in [("title", "TEXT"), ("notes", "TEXT"), ("accommodation", "TEXT"), ("vacation_type", "TEXT"), ("link", "TEXT")]:
            if col not in vac_cols:
                conn.execute(text(f"ALTER TABLE vacations ADD COLUMN {col} {ctype}"))
        conn.commit()
    except Exception:
        pass

# FastAPI App erstellen
app = FastAPI(
    title="Webtech Website API",
    description="Backend API für Webtech Website mit Authentication und User Management",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router einbinden
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(vacations.router)

# Override /api/auth/me endpoint mit Dependency
@app.get("/api/auth/me", response_model=UserResponse, tags=["auth"])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Gibt Informationen über den aktuellen eingeloggten User zurück"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "name": current_user.name,
        "currency_favorites": get_currency_favorites(current_user),
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }


@app.get("/")
async def root():
    """Root Endpoint"""
    return {
        "message": "Webtech Website API",
        "docs": "/docs",
        "version": "1.0.0"
    }
