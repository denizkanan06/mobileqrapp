from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import models


router = APIRouter(
    prefix="/checkins",
    tags=["Check-ins"]
)


@router.post("/{qr_token}")
def check_in_participant(
    qr_token: str,
    db: Session = Depends(get_db)
):
    participant = (
        db.query(models.Participant)
        .filter(models.Participant.qr_token == qr_token)
        .first()
    )

    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Participant not found"
        )

    existing_checkin = (
        db.query(models.CheckIn)
        .filter(
            models.CheckIn.participant_id == participant.id
        )
        .first()
    )

    if existing_checkin:
        raise HTTPException(
            status_code=409,
            detail="Participant has already checked in"
        )

    new_checkin = models.CheckIn(
        event_id=participant.event_id,
        participant_id=participant.id
    )

    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)

    return {
        "message": "Check-in successful",
        "participant": {
            "id": participant.id,
            "full_name": participant.full_name,
            "email": participant.email
        },
        "checkin": new_checkin
    }