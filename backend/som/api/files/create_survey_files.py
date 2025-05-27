from io import BytesIO
import os
from pathlib import Path
import shutil
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from models.csv_file import CSVFile
from models.ecg_file import ECGFile
from models.hr_file import HRFile
from models.hunt import Hunt
from models.iqdat_file import IQDATFile
from models.mp4_file import MP4File
from models.other_file import OtherFile
from models.question import Question
from models.rr_file import RRFile
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.sm_file import SMFile
from models.subject import Subject
from models.survey_number import SurveyNumber
from models.tmk_file import TMKFile
from models.txt_file import TXTFile
import pandas as pd

dict_extensions = {
    "csv": CSVFile,
    "ecg": ECGFile,
    "hr": HRFile,
    "iqdat": IQDATFile,
    "mp4": MP4File,
    "rr": RRFile,
    "sm": SMFile,
    "tmk": TMKFile,
    "txt": TXTFile,
    "other": OtherFile
}


UPLOAD_DIR = Path("/data")

def create_survey_files(
    survey_number_id: int = Path(),
    file_extension: str = Path(),
    files: list[UploadFile] = File([]),
    db: Session = Depends(get_session)
):
    if not files:
        return
    if file_extension not in dict_extensions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"No such extension {file_extension}")
    
    survey_number: SurveyNumber = db.execute(select(SurveyNumber).where(SurveyNumber.id == survey_number_id)).scalar()
    for file in files:
        filename = file.filename.split(".")[0]
        # filename = '_'.join(filename.split("_")[:3])
        subject_db: Subject = db.execute(select(Subject).where(Subject.subject.like(f"%{filename}%"))).scalar()
        if not subject_db:
            # subject_db = Subject(subject=filename)
            # db.add(subject_db)
            # db.flush()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Not found subject with id {filename}")
        session = db.execute(
                select(ModelSession).filter(ModelSession.survey_number_id == survey_number_id, ModelSession.subject_id == subject_db.id)
        ).scalar()
        if not session:
            session = ModelSession(survey_number_id=survey_number_id, subject_id=subject_db.id)
            db.add(session)
            db.flush()
            db.refresh(session)
        file_path = str(UPLOAD_DIR / str(survey_number.number) / file_extension / file.filename)
        if file_extension == "other":
            db.add(dict_extensions[file_extension](path=file_path, survey_number_id=survey_number_id))
        else:
            if not db.execute(select(dict_extensions[file_extension]).filter(dict_extensions[file_extension].session_id == session.id)).scalar():
                db.add(dict_extensions[file_extension](path=file_path, session_id=session.id))
    db.flush()
