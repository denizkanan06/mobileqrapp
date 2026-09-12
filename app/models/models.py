# app/models/models.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    event_date = Column(DateTime, nullable=False)
    capacity = Column(Integer, nullable=False, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

    # İlişkiler
    participants = relationship("Participant", back_populates="event", cascade="all, delete-orphan")
    checkins = relationship("CheckIn", back_populates="event", cascade="all, delete-orphan")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    qr_token = Column(String(64), unique=True, nullable=False, default=lambda: uuid.uuid4().hex)
    created_at = Column(DateTime, default=datetime.utcnow)

    # İlişkiler
    event = relationship("Event", back_populates="participants")
    checkin = relationship("CheckIn", back_populates="participant", uselist=False)


class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    participant_id = Column(UUID(as_uuid=True), ForeignKey("participants.id"), unique=True, nullable=False)
    checked_in_at = Column(DateTime, default=datetime.utcnow)
    gate_staff_id = Column(String(100), nullable=True)

    # İlişkiler
    event = relationship("Event", back_populates="checkins")
    participant = relationship("Participant", back_populates="checkin")