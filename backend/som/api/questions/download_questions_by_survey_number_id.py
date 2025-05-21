import mimetypes
from fastapi import APIRouter, Depends, FastAPI, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, select


def download_questions_by_survey_number_id(survey_number_id: int, db: Session = Depends(get_session)):
    question: Question = db.execute(select(Question).join(ModelSession).filter(ModelSession.survey_number_id == survey_number_id)).scalar()
    mimetype, _ = mimetypes.guess_type(question.path)
    return FileResponse(
        path=question.path,
        filename=question.path.rsplit("/")[0],
        media_type=mimetype or 'application/octet-stream'
    )