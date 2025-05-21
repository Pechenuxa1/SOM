import io
import mimetypes
import os
import zipfile
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Path, Query, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from models.hunt import Hunt
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, select
from models.csv_file import CSVFile
from models.ecg_file import ECGFile
from models.hr_file import HRFile
from models.hunt import Hunt
from models.iqdat_file import IQDATFile
from models.mp4_file import MP4File
from models.other_file import OtherFile
from models.question import Question
from models.rr_file import RRFile
from models.sm_file import SMFile
from models.tmk_file import TMKFile
from models.txt_file import TXTFile


dict_file_types = {
    "questions": Question,
    "hunt": Hunt,
    "csv": CSVFile,
    "ecg": ECGFile,
    "hr": HRFile,
    "iqdat": IQDATFile,
    "mp4": MP4File,
    "rr": RRFile,
    "sm": SMFile,
    "tmk": TMKFile,
    "txt": TXTFile
}


def download_files(survey_number_id: int = Path(), file_types: list[str] = Query([]), db: Session = Depends(get_session)):
    if not all(file_type in dict_file_types for file_type in file_types):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Some file types not exists")
    
    sessions: list[ModelSession] = db.execute(select(ModelSession).filter(ModelSession.survey_number_id == survey_number_id)).all()
    if not sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Not found sessions with survey_number_id {survey_number_id}")
    folder_paths = []
    for file_type in file_types:
        if file_type == "questions":
            folder_paths.append(sessions[0].question.path.split("/")[:-1])
        elif file_type == "hunt":
            folder_paths.append(sessions[0].hunt.path.split("/")[:-1])
        else:
            db_file = db.execute(select(dict_file_types[file_type]).where(dict_file_types[file_type].session_id.in_([session.id for session in sessions]))).scalar()
            folder_paths.append(db_file.path.split("/")[:-1])

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for folder_path in folder_paths:
            for root, _, files in os.walk(folder_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, folder_path)
                    zip_file.write(file_path, arcname=arcname)

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer, 
        media_type="application/zip", 
        headers={
        "Content-Disposition": "attachment; filename=files.zip"
    })