# app/routers/events.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models import models

# All endpoints in this router will start with /events prefix
router = APIRouter(prefix="/events", tags=["Events"])

# Define the format of the incoming data from the frontend (Schema)
class EventCreate(BaseModel):
    title: str
    description: str | None = None
    location: str
    event_date: datetime
    capacity: int = 100

# 1. Create a New Event (POST)
@router.post("/")
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    # Convert Pydantic model to SQLAlchemy model and save to DB
    new_event = models.Event(**event.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# 2. List All Events (GET)
@router.get("/")
def get_events(db: Session = Depends(get_db)):
    # Retrieve all event records from the database
    return db.query(models.Event).all()