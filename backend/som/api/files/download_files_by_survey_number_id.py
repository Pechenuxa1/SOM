import io
import mimetypes
import os
import zipfile
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
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


def download_files_by_survey_number_id(file_extension: str, survey_number_id: int, db: Session = Depends(get_session)):
    if file_extension not in dict_extensions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"No such extension {file_extension}")
    
    sessions: list[ModelSession] = db.execute(select(ModelSession).filter(ModelSession.survey_number_id == survey_number_id)).all()

    if file_extension == "other":
        db_files = db.execute(select(dict_extensions[file_extension]).where(dict_extensions[file_extension].survey_number_id == survey_number_id)).all()
    else:
        db_files = db.execute(select(dict_extensions[file_extension]).where(dict_extensions[file_extension].session_id.in_([session.id for session in sessions]))).all()

    zip_buffer = io.BytesIO()

    folder_path = db_files[0].path.split("/")[:-1]

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
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
        "Content-Disposition": "attachment; filename=archive.zip"
    })