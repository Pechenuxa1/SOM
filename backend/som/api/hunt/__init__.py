from fastapi import APIRouter, status

from schemas.hunt_schema import ListHuntResponse
from som.api.hunt.get_hunt_by_survey_number_id import get_hunt_by_survey_number_id
from som.api.hunt.create_survey_hunt import create_survey_hunt
from som.api.hunt.download_hunt_by_survey_number_id import download_hunt_by_survey_number_id
from som.api.hunt.update_survey_hunt import update_survey_hunt


router = APIRouter(tags=["Hunt"])

router.post("/{survey_number_id}", status_code=status.HTTP_200_OK)(create_survey_hunt)

router.patch("/{survey_number_id}", status_code=status.HTTP_200_OK)(update_survey_hunt)

router.get("/{survey_number_id}/download", status_code=status.HTTP_200_OK)(download_hunt_by_survey_number_id)

router.get("/{survey_number_id}", response_model=ListHuntResponse, status_code=status.HTTP_200_OK)(get_hunt_by_survey_number_id)

