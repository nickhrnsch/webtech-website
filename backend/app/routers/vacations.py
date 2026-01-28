from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import (
    VacationCreate,
    VacationUpdate,
    VacationResponse,
    VacationShareResponse,
    VacationShareAccept,
    VacationParticipantResponse
)
from app.dependencies import get_current_user
from app.crud.vacations import (
    create_vacation,
    list_vacations_for_user,
    get_vacation_by_id,
    update_vacation,
    delete_vacation,
    get_or_create_share_code,
    accept_share_code
)

router = APIRouter(prefix="/api/vacations", tags=["vacations"])


def serialize_vacation(vacation, include_participants: bool = False) -> dict:
    """Serializes a vacation object"""
    result = {
        "id": vacation.id,
        "start_date": vacation.start_date.isoformat(),
        "end_date": vacation.end_date.isoformat(),
        "location": vacation.location,
        "people": vacation.people,
        "share_code": vacation.share_code,
        "created_at": vacation.created_at,
        "updated_at": vacation.updated_at,
    }
    
    if include_participants and vacation.participants:
        result["participants"] = [
            {
                "user_id": p.user_id,
                "username": p.user.username,
                "role": p.role
            }
            for p in vacation.participants
        ]
    
    return result


@router.get("", response_model=list[VacationResponse])
async def list_vacations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Holt alle Urlaube des aktuellen Users"""
    vacations = list_vacations_for_user(db, current_user)
    return [serialize_vacation(v, include_participants=True) for v in vacations]


@router.post("", response_model=VacationResponse, status_code=status.HTTP_201_CREATED)
async def create_vacation_endpoint(
    payload: VacationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Erstellt einen neuen Urlaub"""
    vacation = create_vacation(db, current_user, payload)
    return serialize_vacation(vacation, include_participants=True)


@router.get("/{vacation_id}", response_model=VacationResponse)
async def get_vacation(
    vacation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Holt einen einzelnen Urlaub"""
    vacation = get_vacation_by_id(db, vacation_id)
    if not vacation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Urlaub nicht gefunden"
        )
    
    # Check if user is participant
    from app.crud.vacations import is_user_participant
    if not is_user_participant(db, current_user, vacation_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Urlaub"
        )
    
    return serialize_vacation(vacation, include_participants=True)


@router.put("/{vacation_id}", response_model=VacationResponse)
async def update_vacation_endpoint(
    vacation_id: int,
    payload: VacationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Aktualisiert einen Urlaub"""
    try:
        vacation = update_vacation(db, current_user, vacation_id, payload)
        return serialize_vacation(vacation, include_participants=True)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.delete("/{vacation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vacation_endpoint(
    vacation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Löscht einen Urlaub"""
    try:
        delete_vacation(db, current_user, vacation_id)
        return None
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.post("/{vacation_id}/share", response_model=VacationShareResponse)
async def create_share_link(
    vacation_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Erstellt einen Share-Link für einen Urlaub"""
    try:
        share_code = get_or_create_share_code(db, current_user, vacation_id)
        # Build share URL
        base_url = str(request.base_url).rstrip('/')
        share_url = f"{base_url}/calendar?vacationShare={share_code}"
        
        return {
            "share_code": share_code,
            "share_url": share_url
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.post("/share/accept", response_model=VacationResponse)
async def accept_share_link(
    payload: VacationShareAccept,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Akzeptiert einen Share-Link und fügt User als Participant hinzu"""
    try:
        vacation = accept_share_code(db, current_user, payload.share_code)
        return serialize_vacation(vacation, include_participants=True)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
