from sqlalchemy import Column, Integer, String, Boolean, Date, Time, Double, ForeignKey

from db.base import Base


class OtherFile(Base):
    __tablename__ = "other_file"

    id = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String, nullable=True)

    survey_number_id = Column(Integer, ForeignKey("survey_number.id"), nullable=True)
