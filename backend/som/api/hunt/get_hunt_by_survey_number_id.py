from fastapi import APIRouter, Depends, FastAPI, Path, Query, status
from sqlalchemy.orm import Session
from models.hunt import Hunt
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, select

from models.subject import Subject
from schemas.hunt_schema import HuntResponse, ListHuntResponse
from schemas.question_schema import ListQuestionResponse

def get_hunt_by_survey_number_id(survey_number_id: int = Path(), sort: bool = Query(False), db: Session = Depends(get_session)):
    sessions_with_hunt = db.execute(
        select(ModelSession, Hunt)
        .outerjoin(Hunt)
        .filter(ModelSession.survey_number_id == survey_number_id)
    ).all()

    result_hunt = []
    
    for session, hunt in sessions_with_hunt:
        if hunt is None:
            hunt = HuntResponse()
            hunt.subject = db.execute(select(Subject.subject).join(ModelSession, Subject.id == ModelSession.subject_id).filter(ModelSession.id == session.id)).scalar()
            hunt.hunt = False
        else:
            hunt.subject = db.execute(select(Subject.subject).join(ModelSession, Subject.id == ModelSession.subject_id).filter(ModelSession.hunt_id == hunt.id)).scalar()
            hunt.hunt = hunt.is_fill
        
        result_hunt.append(hunt)

    if sort:
        result_hunt.sort(
            key=lambda h: sum([
                not h.hunt,
            ]),
            reverse=True
        )
    else:
        result_hunt.sort(
            key=lambda h: h.subject or "",
            reverse=False
        )

    return ListHuntResponse(hunts=result_hunt)