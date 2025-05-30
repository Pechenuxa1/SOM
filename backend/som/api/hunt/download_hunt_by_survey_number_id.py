import mimetypes
from fastapi import APIRouter, Depends, FastAPI, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from models.hunt import Hunt
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, select


def download_hunt_by_survey_number_id(survey_number_id: int, db: Session = Depends(get_session)):
    hunt: Hunt = db.execute(select(Hunt).join(ModelSession).filter(ModelSession.survey_number_id == survey_number_id)).scalar()
    mimetype, _ = mimetypes.guess_type(hunt.path)
    return FileResponse(
        path=hunt.path,
        filename=hunt.path.rsplit("/")[0],
        media_type=mimetype or 'application/octet-stream'
    )