from fastapi import APIRouter, status
from fastapi.responses import StreamingResponse

from schemas.session_schema import ListSessionResponse
from schemas.survey_number_schema import SurveyNumberResponse, SurveyTotalNumberResponse
from som.api.files.create_survey_files import create_survey_files
from som.api.hunt.create_survey_hunt import create_survey_hunt
from som.api.questions.create_survey_questions import create_survey_questions
from som.api.survey.create_survey import create_survey
from som.api.hunt.download_hunt_by_survey_number_id import download_hunt_by_survey_number_id
from som.api.questions.download_questions_by_survey_number_id import download_questions_by_survey_number_id
from som.api.sessions.get_sessions_by_survey_number_id import get_sessions_by_survey_number_id
from som.api.survey.download_files import download_files
from som.api.survey.get_surveys_total_number import get_surveys_total_number
from som.api.hunt.update_survey_hunt import update_survey_hunt
from som.api.questions.update_survey_questions import update_survey_questions
from som.api.survey.update_survey import update_survey


router = APIRouter(tags=["Survey"])

router.post("/", status_code=status.HTTP_200_OK, response_model=SurveyNumberResponse)(create_survey)

router.get("/total-number", response_model=SurveyTotalNumberResponse, status_code=status.HTTP_200_OK)(get_surveys_total_number)

router.get("/{survey_number_id}/download", status_code=status.HTTP_200_OK)(download_files)

router.patch("/{survey_number_id}", status_code=status.HTTP_200_OK)(update_survey)