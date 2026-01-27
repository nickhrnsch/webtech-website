from __future__ import annotations

from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """Validiert Passwort-Länge (bcrypt Limit: 72 Bytes)"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Passwort darf maximal 72 Bytes lang sein (ca. 72 Zeichen bei ASCII)')
        if len(v) < 6:
            raise ValueError('Passwort muss mindestens 6 Zeichen lang sein')
        return v


class UserLogin(BaseModel):
    username: str
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """Validiert Passwort-Länge (bcrypt Limit: 72 Bytes)"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Passwort darf maximal 72 Bytes lang sein (ca. 72 Zeichen bei ASCII)')
        return v


class UserResponse(UserBase):
    id: int
    currency_favorites: Optional[List["CurrencyFavorite"]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class CurrencyFavorite(BaseModel):
    from_currency: str = Field(alias="from")
    to_currency: str = Field(alias="to")
    label: str

    class Config:
        populate_by_name = True


class CurrencyFavoritesUpdate(BaseModel):
    favorites: List[CurrencyFavorite]


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
