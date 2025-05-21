from fastapi import APIRouter, status

from schemas.file_schemas import ListFileResponse, ListFileNameResponse
from som.api.files.create_survey_files import create_survey_files
from som.api.files.download_files_by_survey_number_id import (
    download_files_by_survey_number_id,
)
from som.api.files.download_other_file import download_other_file
from som.api.files.get_files_by_survey_number_id import get_files_by_survey_number_id
from som.api.files.get_list_other_files import get_list_other_files


router = APIRouter(tags=["Files"])

router.post("/{survey_number_id}/{file_extension}", status_code=status.HTTP_200_OK)(
    create_survey_files
)

router.get(
    "/{survey_number_id}/{file_extension}/download", status_code=status.HTTP_200_OK
)(download_files_by_survey_number_id)

router.get(
    "/other/{survey_number_id}/",
    response_model=ListFileNameResponse,
    status_code=status.HTTP_200_OK,
)(get_list_other_files)

router.get("/other/file/{other_file_id}/", status_code=status.HTTP_200_OK)(
    download_other_file
)

router.get(
    "/{survey_number_id}",
    response_model=ListFileResponse,
    status_code=status.HTTP_200_OK,
)(get_files_by_survey_number_id)
