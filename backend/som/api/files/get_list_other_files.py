from fastapi import Depends
from sqlalchemy.orm import Session

from db.base import get_session
from sqlalchemy import select
from models.other_file import OtherFile
from schemas.file_schemas import ListFileNameResponse, FileNameResponse


def get_list_other_files(
    survey_number_id: int, db: Session = Depends(get_session)
) -> ListFileNameResponse:
    other_files = (
        db.query(OtherFile).filter(OtherFile.survey_number_id == survey_number_id).all()
    )

    files = ListFileNameResponse(files=[])
    for other_file in other_files:
        files.files.append(
            FileNameResponse(name=other_file.path.split("/")[-1], id=other_file.id)
        )

    return files
