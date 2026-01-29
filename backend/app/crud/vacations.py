from sqlalchemy.orm import Session
from app.models import Vacation, VacationParticipant, User
from app.schemas import VacationCreate, VacationUpdate
import uuid
from datetime import date


def create_vacation(db: Session, owner_user: User, payload: VacationCreate) -> Vacation:
    """Erstellt einen neuen Urlaub mit dem User als Owner"""
    vacation = Vacation(
        start_date=payload.start_date,
        end_date=payload.end_date,
        location=payload.location,
        people=payload.people,
        title=payload.title,
        notes=payload.notes,
        accommodation=payload.accommodation,
        vacation_type=payload.vacation_type,
        link=payload.link,
    )
    db.add(vacation)
    db.flush()  # Flush to get vacation.id
    
    # Add owner as participant
    participant = VacationParticipant(
        vacation_id=vacation.id,
        user_id=owner_user.id,
        role="owner"
    )
    db.add(participant)
    db.commit()
    db.refresh(vacation)
    return vacation


def list_vacations_for_user(db: Session, user: User) -> list[Vacation]:
    """Holt alle Urlaube, bei denen der User Participant ist"""
    return (
        db.query(Vacation)
        .join(VacationParticipant)
        .filter(VacationParticipant.user_id == user.id)
        .order_by(Vacation.start_date.desc())
        .all()
    )


def get_vacation_by_id(db: Session, vacation_id: int) -> Vacation | None:
    """Holt einen Urlaub anhand der ID"""
    return db.query(Vacation).filter(Vacation.id == vacation_id).first()


def is_user_participant(db: Session, user: User, vacation_id: int) -> bool:
    """Prüft ob User Participant des Urlaubs ist"""
    return (
        db.query(VacationParticipant)
        .filter(
            VacationParticipant.vacation_id == vacation_id,
            VacationParticipant.user_id == user.id
        )
        .first()
    ) is not None


def update_vacation(db: Session, user: User, vacation_id: int, payload: VacationUpdate) -> Vacation:
    """Aktualisiert einen Urlaub (nur wenn User Participant ist)"""
    vacation = get_vacation_by_id(db, vacation_id)
    if not vacation:
        raise ValueError("Urlaub nicht gefunden")
    
    if not is_user_participant(db, user, vacation_id):
        raise PermissionError("Keine Berechtigung für diesen Urlaub")
    
    if payload.start_date is not None:
        vacation.start_date = payload.start_date
    if payload.end_date is not None:
        vacation.end_date = payload.end_date
    if payload.location is not None:
        vacation.location = payload.location
    if payload.people is not None:
        vacation.people = payload.people
    if payload.title is not None:
        vacation.title = payload.title
    if payload.notes is not None:
        vacation.notes = payload.notes
    if payload.accommodation is not None:
        vacation.accommodation = payload.accommodation
    if payload.vacation_type is not None:
        vacation.vacation_type = payload.vacation_type
    if payload.link is not None:
        vacation.link = payload.link

    db.commit()
    db.refresh(vacation)
    return vacation


def delete_vacation(db: Session, user: User, vacation_id: int) -> bool:
    """Löscht einen Urlaub (nur wenn User Participant ist)"""
    vacation = get_vacation_by_id(db, vacation_id)
    if not vacation:
        raise ValueError("Urlaub nicht gefunden")
    
    if not is_user_participant(db, user, vacation_id):
        raise PermissionError("Keine Berechtigung für diesen Urlaub")
    
    db.delete(vacation)
    db.commit()
    return True


def get_or_create_share_code(db: Session, user: User, vacation_id: int) -> str:
    """Erstellt oder holt den share_code für einen Urlaub"""
    vacation = get_vacation_by_id(db, vacation_id)
    if not vacation:
        raise ValueError("Urlaub nicht gefunden")
    
    if not is_user_participant(db, user, vacation_id):
        raise PermissionError("Keine Berechtigung für diesen Urlaub")
    
    if vacation.share_code:
        return vacation.share_code
    
    # Generate unique share code
    while True:
        share_code = str(uuid.uuid4())[:8]
        existing = db.query(Vacation).filter(Vacation.share_code == share_code).first()
        if not existing:
            break
    
    vacation.share_code = share_code
    db.commit()
    db.refresh(vacation)
    return share_code


def accept_share_code(db: Session, user: User, share_code: str) -> Vacation:
    """Fügt User als Participant zu einem Urlaub via share_code hinzu"""
    vacation = db.query(Vacation).filter(Vacation.share_code == share_code).first()
    if not vacation:
        raise ValueError("Ungültiger Share-Code")
    
    # Check if user is already a participant
    existing = (
        db.query(VacationParticipant)
        .filter(
            VacationParticipant.vacation_id == vacation.id,
            VacationParticipant.user_id == user.id
        )
        .first()
    )
    
    if existing:
        # Already a participant, just return the vacation
        return vacation
    
    # Add as member
    participant = VacationParticipant(
        vacation_id=vacation.id,
        user_id=user.id,
        role="member"
    )
    db.add(participant)
    db.commit()
    db.refresh(vacation)
    return vacation
