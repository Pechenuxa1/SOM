from io import BytesIO
from pathlib import Path
import shutil
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import distinct, func, select

from models.subject import Subject
from models.survey_number import SurveyNumber
import pandas as pd

from schemas.survey_number_schema import SurveyNumberResponse

dict_psy_tests = {
    "bdi": 21,
    "sp_before": 20,
    "sp_after": 20,
    "st": 20,
    "gld": 50,
    "sfa": 11,
    "scs": 23
}

def parse_psy_test_and_is_fill(test: str, row: pd.Series, db: Session) -> int:
    test_columns = [f"{test}_{index}" for index in range(1, dict_psy_tests[test]+1)]
    missing_or_empty = [col for col in test_columns if col not in row or pd.isna(row[col])]

    return not missing_or_empty

UPLOAD_DIR = Path("/data/")

def create_survey_questions(
    survey_number_id: int = Path(),
    questions_file: UploadFile = File(None),
    db: Session = Depends(get_session)
):
    if not questions_file:
        return
    
    contents = questions_file.file.read()

    df = pd.read_excel(BytesIO(contents))

    survey_number: SurveyNumber = db.execute(select(SurveyNumber).where(SurveyNumber.id == survey_number_id)).scalar()

    file_path = str(UPLOAD_DIR / str(survey_number.number) / "questions" / questions_file.filename)

    if "subj_id" in df.columns:
        for _, row in df.iterrows():
            subject = row['subj_id']
            subject_db: Subject = db.execute(select(Subject).where(Subject.subject == subject)).scalar()

            sex = next((row[col] for col in df.columns if "sex" in col.lower()), None)
            sex = "male" if sex == 1 else "female" if sex == 2 else None
            
            foreign = next((row[col] for col in df.columns if "foreign" in col.lower()), None)
            foreign = True if foreign == 1 else False if foreign == 0 else None

            birth_date = next((row[col] for col in df.columns if "birth_date" in col.lower()), None)
            
            if not subject_db:
                subject_db = Subject(sex=sex, foreign=foreign, birth_date=birth_date)
                db.add(subject_db)
                db.flush()
                db.refresh(subject_db)
            else:
                subject_db.sex = sex
                subject_db.foreign = foreign
                subject_db.birth_date = birth_date

            question = Question(
                path=file_path, 
                if_fill_sp_before = parse_psy_test_and_is_fill("sp_before", row, db),
                if_fill_sp_after = parse_psy_test_and_is_fill("sp_after", row, db),
                is_fill_st = parse_psy_test_and_is_fill("st", row, db),
                is_fill_scs = parse_psy_test_and_is_fill("scs", row, db),
                is_fill_sfa = parse_psy_test_and_is_fill("sfa", row, db),
                is_fill_gld = parse_psy_test_and_is_fill("gld", row, db),
                is_fill_bdi = parse_psy_test_and_is_fill("bdi", row, db)  
            )
            db.add(question)
            db.flush()
            db.refresh(question)

            session = ModelSession(survey_number_id=survey_number_id, question_id=question.id, subject_id=subject_db.id)
            db.add(session)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must have column subj_id")

    db.flush()
    