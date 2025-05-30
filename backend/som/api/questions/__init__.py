from fastapi import APIRouter, status

from schemas.question_schema import ListQuestionResponse
from som.api.questions.create_survey_questions import create_survey_questions
from som.api.questions.get_questions_by_survey_number_id import get_questions_by_survey_number_id
from som.api.questions.download_questions_by_survey_number_id import download_questions_by_survey_number_id
from som.api.questions.update_survey_questions import update_survey_questions


router = APIRouter(tags=["Questions"])

router.post("/{survey_number_id}", status_code=status.HTTP_200_OK)(create_survey_questions)

router.patch("/{survey_number_id}", status_code=status.HTTP_200_OK)(update_survey_questions)

router.get("/{survey_number_id}/download", response_model=int, status_code=status.HTTP_200_OK)(download_questions_by_survey_number_id)

router.get("/{survey_number_id}", response_model=ListQuestionResponse, status_code=status.HTTP_200_OK)(get_questions_by_survey_number_id)
