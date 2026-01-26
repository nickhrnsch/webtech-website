from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifiziert ein Passwort gegen den Hash"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def get_password_hash(password: str) -> str:
    """Erstellt einen bcrypt Hash für ein Passwort
    
    Bcrypt hat ein Limit von 72 Bytes. Längere Passwörter werden automatisch gekürzt.
    """
    # Bcrypt limit ist 72 Bytes - kürze sicher auf max 72 Bytes
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Kürze auf 72 Bytes
        truncated_bytes = password_bytes[:72]
        # Entferne eventuelle unvollständige UTF-8 Sequenzen am Ende
        while len(truncated_bytes) > 0 and (truncated_bytes[-1] & 0xC0) == 0x80:
            truncated_bytes = truncated_bytes[:-1]
        password_bytes = truncated_bytes
    
    # Hash mit bcrypt direkt (nicht über passlib)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Erstellt ein JWT Access Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Dekodiert und verifiziert ein JWT Token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
