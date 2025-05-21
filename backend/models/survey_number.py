from sqlalchemy import Column, Integer, String, Boolean, Date, Time

from db.base import Base


class SurveyNumber(Base):
    __tablename__ = "survey_number"

    id = Column(Integer, primary_key=True, autoincrement=True)
    number = Column(Integer, nullable=False)
