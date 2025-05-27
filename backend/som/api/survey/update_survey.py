import os
from pathlib import Path
from sqlalchemy.orm import Session
from schemas.survey_number_schema import SurveyNumberResponse
import shutil
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile, status

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.survey_number import SurveyNumber

from som.api.files.create_survey_files import create_survey_files
from som.api.hunt.create_survey_hunt import create_survey_hunt
from som.api.hunt.update_survey_hunt import update_survey_hunt
from som.api.questions.create_survey_questions import create_survey_questions
from fastapi import Path as UrlPath

from som.api.questions.update_survey_questions import update_survey_questions


UPLOAD_DIR = Path("/data/")


def save_files(files: list[UploadFile], file_type: str, survey_number: int):
    if not files:
        return
    
    save_dir = UPLOAD_DIR / str(survey_number) / file_type
    os.makedirs(save_dir, exist_ok=True)

    for file in files:
        file_path = save_dir / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)


def delete_files(files: list[UploadFile], file_type: str, survey_number: int):
    if not files:
        return
    
    for file in files:
        file_path = UPLOAD_DIR / str(survey_number) / file_type / file.filename
        if file_path.exists():
            file_path.unlink()


def update_survey(
    survey_number_id: int = UrlPath(),
    questions_file: UploadFile = File(None),
    hunt_file: UploadFile = File(None),
    csv_files: list[UploadFile] = File(None),
    ecg_files: list[UploadFile] = File(None),
    hr_files: list[UploadFile] = File(None),
    iqdat_files: list[UploadFile] = File(None),
    mp4_files: list[UploadFile] = File(None),
    rr_files: list[UploadFile] = File(None),
    sm_files: list[UploadFile] = File(None),
    tmk_files: list[UploadFile] = File(None),
    txt_files: list[UploadFile] = File(None),
    other_files: list[UploadFile] = File(None),
    db: Session = Depends(get_session),
) -> SurveyNumberResponse:
    survey_number: SurveyNumber = db.execute(select(SurveyNumber).where(SurveyNumber.id == survey_number_id)).scalar()
    if not survey_number:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Not found survey with survey_number_id {survey_number_id}")

    update_survey_questions(survey_number_id=survey_number.id, questions_file=questions_file, db=db)
    update_survey_hunt(survey_number_id=survey_number.id, hunt_file=hunt_file, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="csv", files=csv_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="ecg", files=ecg_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="hr", files=hr_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="iqdat", files=iqdat_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="mp4", files=mp4_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="rr", files=rr_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="sm", files=sm_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="tmk", files=tmk_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="txt", files=txt_files, db=db)
    create_survey_files(survey_number_id=survey_number.id, file_extension="other", files=other_files, db=db)

    try:
        save_files(questions_file, "questions", survey_number=survey_number.number)
        save_files(hunt_file, "hunt", survey_number=survey_number.number)
        save_files(csv_files, "csv", survey_number=survey_number.number)
        save_files(ecg_files, "ecg", survey_number=survey_number.number)
        save_files(hr_files, "hr", survey_number=survey_number.number)
        save_files(iqdat_files, "iqdat", survey_number=survey_number.number)
        save_files(mp4_files, "mp4", survey_number=survey_number.number)
        save_files(rr_files, "rr", survey_number=survey_number.number)
        save_files(sm_files, "sm", survey_number=survey_number.number)
        save_files(tmk_files, "tmk", survey_number=survey_number.number)
        save_files(txt_files, "txt", survey_number=survey_number.number)
        save_files(other_files, "other", survey_number=survey_number.number)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    db.commit()

    return survey_number