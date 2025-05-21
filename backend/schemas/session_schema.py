import datetime
from pydantic import BaseModel


class SessionResponse(BaseModel):
    subject: str | None = None

    hunt: bool | None = None
    question: bool | None = None

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


class ListSessionResponse(BaseModel):
    sessions: list[SessionResponse]