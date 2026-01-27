from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.crud.user import create_user, authenticate_user, get_user_by_username, get_currency_favorites
from app.auth import create_access_token
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registriert einen neuen User"""
    try:
        user = create_user(db, user_data)
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "currency_favorites": get_currency_favorites(user),
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login Endpoint - gibt JWT Token zurück"""
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ungültiger Username oder Passwort",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# /me endpoint wird in main.py definiert, da es get_current_user Dependency benötigt
