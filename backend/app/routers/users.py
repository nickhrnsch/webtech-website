from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserResponse, UserProfileUpdate, CurrencyFavoritesUpdate, CurrencyFavorite
from app.dependencies import get_current_user
from app.crud.user import update_user_profile, get_currency_favorites, set_currency_favorites

router = APIRouter(prefix="/api/users", tags=["users"])


def serialize_user(user: User) -> dict:
    """Serialize user including favorites."""
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "currency_favorites": get_currency_favorites(user),
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Holt das Profil des aktuellen Users"""
    return serialize_user(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Aktualisiert das Profil des aktuellen Users"""
    try:
        updated_user = update_user_profile(db, current_user, profile_update)
        return serialize_user(updated_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/favorites/currency", response_model=list[CurrencyFavorite])
async def get_currency_favorites_endpoint(current_user: User = Depends(get_current_user)):
    """Holt Währungs-Favoriten des aktuellen Users"""
    return get_currency_favorites(current_user)


@router.put("/favorites/currency", response_model=list[CurrencyFavorite])
async def update_currency_favorites_endpoint(
    payload: CurrencyFavoritesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Speichert Währungs-Favoriten des aktuellen Users"""
    # Convert Pydantic models to dict with aliases (from/to)
    favorites = [fav.model_dump(by_alias=True) for fav in payload.favorites]
    updated_user = set_currency_favorites(db, current_user, favorites)
    return get_currency_favorites(updated_user)
