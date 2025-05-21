from fastapi import APIRouter, status

from schemas.session_schema import ListSessionResponse
from som.api.sessions.get_sessions_by_survey_number_id import get_sessions_by_survey_number_id


router = APIRouter(tags=["Session"])

router.get("/{survey_number_id}", response_model=ListSessionResponse, status_code=status.HTTP_200_OK)(get_sessions_by_survey_number_id)
