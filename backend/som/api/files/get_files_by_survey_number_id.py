from fastapi import APIRouter, Depends, FastAPI, HTTPException, Path, Query, status
from sqlalchemy.orm import Session
from models.csv_file import CSVFile
from models.ecg_file import ECGFile
from models.hr_file import HRFile
from models.iqdat_file import IQDATFile
from models.mp4_file import MP4File
from models.question import Question
from models.rr_file import RRFile
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.sm_file import SMFile
from models.subject import Subject
from models.tmk_file import TMKFile
from models.txt_file import TXTFile
from schemas.file_schemas import FileResponse, ListFileResponse
from schemas.session_schema import ListSessionResponse, SessionResponse


def get_files_by_survey_number_id(survey_number_id: int = Path(), sort: bool = Query(False), db: Session = Depends(get_session)):
    sessions: list[ModelSession] = db.execute(select(ModelSession).where(ModelSession.survey_number_id == survey_number_id).order_by(ModelSession.subject_id)).scalars().all()
    files_response = ListFileResponse(files=[])
    for session in sessions:
        session_resp = FileResponse()
        session_resp.subject = db.execute(select(Subject.subject).where(Subject.id == session.subject_id)).scalar()
        session_resp.csv_file = True if db.execute(select(CSVFile).where(CSVFile.session_id == session.id)).scalar() else False
        session_resp.ecg_file = True if db.execute(select(ECGFile).where(ECGFile.session_id == session.id)).scalar() else False
        session_resp.hr_file = True if db.execute(select(HRFile).where(HRFile.session_id == session.id)).scalar() else False
        session_resp.iqdat_file = True if db.execute(select(IQDATFile).where(IQDATFile.session_id == session.id)).scalar() else False
        session_resp.mp4_file = True if db.execute(select(MP4File).where(MP4File.session_id == session.id)).scalar() else False
        session_resp.rr_file = True if db.execute(select(RRFile).where(RRFile.session_id == session.id)).scalar() else False
        session_resp.sm_file = True if db.execute(select(SMFile).where(SMFile.session_id == session.id)).scalar() else False
        session_resp.tmk_file = True if db.execute(select(TMKFile).where(TMKFile.session_id == session.id)).scalar() else False
        session_resp.txt_file = True if db.execute(select(TXTFile).where(TXTFile.session_id == session.id)).scalar() else False

        files_response.files.append(session_resp)
    if sort == True:
        bool_fields = [
            'csv_file', 'ecg_file', 
            'hr_file', 'iqdat_file', 'mp4_file', 'rr_file', 
            'sm_file', 'tmk_file', 'txt_file'
        ]

        files_response.files.sort(
            key=lambda x: sum(1 for field in bool_fields if getattr(x, field) is False),
            reverse=True
        )

    return files_response
