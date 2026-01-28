from sqlalchemy import Column, Integer, String, DateTime, Text, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    currency_favorites = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    vacation_participations = relationship("VacationParticipant", back_populates="user", cascade="all, delete-orphan")


class Vacation(Base):
    __tablename__ = "vacations"
    
    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    location = Column(String, nullable=True)
    people = Column(String, nullable=True)
    share_code = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    participants = relationship("VacationParticipant", back_populates="vacation", cascade="all, delete-orphan")


class VacationParticipant(Base):
    __tablename__ = "vacation_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    vacation_id = Column(Integer, ForeignKey("vacations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False, default="member")  # owner or member
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    vacation = relationship("Vacation", back_populates="participants")
    user = relationship("User", back_populates="vacation_participations")
