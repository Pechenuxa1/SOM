from fastapi import APIRouter, status

from schemas.subject_schema import ListSubjectResponse
from som.api.subjects.get_subjects import get_subjects


router = APIRouter(tags=["Subject"])

router.get("/", response_model=ListSubjectResponse, status_code=status.HTTP_200_OK)(get_subjects)
