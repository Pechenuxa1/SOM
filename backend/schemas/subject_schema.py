from datetime import date
from pydantic import BaseModel


class SubjectResponse(BaseModel):
    subject: str | None = None
    sex: str | None = None
    foreign: bool | None = None
    birth_date: date | None = None
    sessions: list[int] | None = None

    class Config:
        from_attributes = True


class ListSubjectResponse(BaseModel):
    participants: list[SubjectResponse]
