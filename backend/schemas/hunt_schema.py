import datetime
from pydantic import BaseModel


class HuntResponse(BaseModel):

    subject: str | None = None
    hunt: bool | None = None

    class Config:
        from_attributes = True


class ListHuntResponse(BaseModel):
    hunts: list[HuntResponse]