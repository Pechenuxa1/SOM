from io import BytesIO
from pathlib import Path
import shutil
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from models.hunt import Hunt
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.subject import Subject
from models.survey_number import SurveyNumber
from schemas.survey_number_schema import SurveyTotalNumberResponse
import pandas as pd


UPLOAD_DIR = Path("/data")

def update_survey_hunt(
    survey_number_id: int = Path(),
    hunt_file: UploadFile = File(),
    db: Session = Depends(get_session)
):
    contents = hunt_file.file.read()

    df = pd.read_excel(BytesIO(contents))

    survey_number: SurveyNumber = db.execute(select(SurveyNumber).where(SurveyNumber.id == survey_number_id)).scalar()

    file_path = UPLOAD_DIR / survey_number.number / "hunt" / hunt_file.filename

    if "subj_id" in df.columns:
        for _, row in df.iterrows():
            subject = row['subj_id']
            subject_db: Subject = db.execute(select(Subject).where(Subject.subject == subject)).scalar()
            if not subject_db:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Not found subject with id {subject}")
            
            session: ModelSession = db.execute(
                select(ModelSession).filter(ModelSession.survey_number_id == survey_number_id, ModelSession.subject_id == subject_db.id)
            ).scalar()
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Not found session with survey_number_id {survey_number_id} and subject_id {subject_db.id}"
                )
            
            is_fill = all([
                next((not pd.isna(row[col]) for col in df.columns if "premature_stop" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "wrong_stop" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "correct_stop_pct" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "go_misses" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "wrong_button" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "correct_go_pct" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "lat_mean" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "lat_std" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "average_rt_practice" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "timely_go_pct" in col), None),
                next((not pd.isna(row[col]) for col in df.columns if "lat_box_cox" in col), None),
            ])

            hunt = db.get(Hunt, session.hunt_id)
            hunt.is_fill = is_fill
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must have column subj_id")

    db.flush()