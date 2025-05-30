import datetime
from pydantic import BaseModel


class FileNameResponse(BaseModel):
    id: int | None = None
    name: str | None = None

    class Config:
        from_attributes = True


class ListFileNameResponse(BaseModel):
    files: list[FileNameResponse]


class FileResponse(BaseModel):
    subject: str | None = None

    csv_file: bool | None = None
    ecg_file: bool | None = None
    hr_file: bool | None = None
    iqdat_file: bool | None = None
    mp4_file: bool | None = None
    rr_file: bool | None = None
    sm_file: bool | None = None
    tmk_file: bool | None = None
    txt_file: bool | None = None

    class Config:
        from_attributes = True


class ListFileResponse(BaseModel):
    files: list[FileResponse]
