import datetime
from pydantic import BaseModel


class SurveyNumberResponse(BaseModel):
    id: int
    number: int

    class Config:
        from_attributes = True


class SurveyTotalNumberResponse(BaseModel):
    surveys: list[SurveyNumberResponse] | None = None
    number: int | None = None

    class Config:
        from_attributes = True