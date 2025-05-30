from models.survey_number import SurveyNumber
from fastapi import APIRouter, Depends, FastAPI, status
from sqlalchemy.orm import Session
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, select

from models.subject import Subject
from schemas.subject_schema import ListSubjectResponse


def get_subjects(db: Session = Depends(get_session)):
    subjects = db.execute(select(Subject)).scalars().all()
    for subject in subjects:
        query = select(distinct(ModelSession.survey_number_id)).where(ModelSession.subject_id == subject.id)
        sessions = db.execute(query).scalars().all()
        survey_numbers = db.execute(select(SurveyNumber.number).where(SurveyNumber.id.in_(sessions))).scalars().all()
        subject.sessions = survey_numbers
    return ListSubjectResponse(participants=subjects)