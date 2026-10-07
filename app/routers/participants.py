from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import models


router = APIRouter(
    prefix="/participants",
    tags=["Participants"]
)


class ParticipantCreate(BaseModel):
    event_id: UUID
    full_name: str
    email: EmailStr


@router.post("/")
def create_participant(
    participant: ParticipantCreate,
    db: Session = Depends(get_db)
):
    event = (
        db.query(models.Event)
        .filter(models.Event.id == participant.event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    new_participant = models.Participant(
        event_id=participant.event_id,
        full_name=participant.full_name,
        email=participant.email,
    )

    db.add(new_participant)
    db.commit()
    db.refresh(new_participant)

    return new_participant


@router.get("/event/{event_id}")
def get_event_participants(
    event_id: UUID,
    db: Session = Depends(get_db)
):
    event = (
        db.query(models.Event)
        .filter(models.Event.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return (
        db.query(models.Participant)
        .filter(models.Participant.event_id == event_id)
        .all()
    )