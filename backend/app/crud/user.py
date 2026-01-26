from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, UserProfileUpdate
import json
from app.auth import get_password_hash, verify_password


def get_user_by_username(db: Session, username: str) -> User | None:
    """Holt einen User anhand des Usernames"""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    """Holt einen User anhand der Email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Holt einen User anhand der ID"""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate) -> User:
    """Erstellt einen neuen User"""
    # Prüfe ob Username bereits existiert
    if get_user_by_username(db, user.username):
        raise ValueError("Username bereits vergeben")
    
    # Prüfe ob Email bereits existiert
    if get_user_by_email(db, user.email):
        raise ValueError("Email bereits vergeben")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        abteilung=user.abteilung
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    """Authentifiziert einen User mit Username und Passwort"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_user_profile(db: Session, user: User, profile_update: UserProfileUpdate) -> User:
    """Aktualisiert das Profil eines Users"""
    if profile_update.name is not None:
        user.name = profile_update.name
    if profile_update.email is not None:
        # Prüfe ob Email bereits von anderem User verwendet wird
        existing_user = get_user_by_email(db, profile_update.email)
        if existing_user and existing_user.id != user.id:
            raise ValueError("Email bereits vergeben")
        user.email = profile_update.email
    if profile_update.abteilung is not None:
        user.abteilung = profile_update.abteilung
    
    db.commit()
    db.refresh(user)
    return user


def get_currency_favorites(user: User) -> list[dict]:
    """Holt die Währungs-Favoriten eines Users"""
    if not user.currency_favorites:
        return []
    try:
        return json.loads(user.currency_favorites)
    except (json.JSONDecodeError, TypeError):
        return []


def set_currency_favorites(db: Session, user: User, favorites: list[dict]) -> User:
    """Speichert die Währungs-Favoriten eines Users"""
    user.currency_favorites = json.dumps(favorites)
    db.commit()
    db.refresh(user)
    return user
