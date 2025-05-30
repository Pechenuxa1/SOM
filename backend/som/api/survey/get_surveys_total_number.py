from fastapi import APIRouter, Depends, FastAPI, status
from sqlalchemy.orm import Session
from models.session import Session as Survey

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.survey_number import SurveyNumber
from schemas.survey_number_schema import SurveyNumberResponse, SurveyTotalNumberResponse


def get_surveys_total_number(db: Session = Depends(get_session)):
    surveys = db.execute(select(SurveyNumber).order_by(SurveyNumber.number)).scalars().all()
    surveys_total_number = db.execute(select(func.max(SurveyNumber.number))).scalar()
    surveys_response = []
    for survey in surveys:
        surveys_response.append(SurveyNumberResponse(id=survey.id, number=survey.number))
    return SurveyTotalNumberResponse(surveys=surveys_response, number=surveys_total_number)
