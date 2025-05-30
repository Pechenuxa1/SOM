import datetime
from pydantic import BaseModel


class QuestionResponse(BaseModel):

    subject: str | None = None

    sp_before: bool | None = None
    sp_after: bool | None = None
    st: bool | None = None
    scs: bool | None = None
    sfa: bool | None = None
    gld: bool | None = None
    bdi: bool | None = None

    class Config:
        from_attributes = True


class ListQuestionResponse(BaseModel):
    questions: list[QuestionResponse]