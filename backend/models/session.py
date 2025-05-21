from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey
from sqlalchemy.orm import relationship

from db.base import Base


class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, autoincrement=True)

    survey_number_id = Column(Integer, ForeignKey("survey_number.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('question.id'), nullable=True)
    hunt_id = Column(Integer, ForeignKey('hunt.id'), nullable=True)

    question = relationship("Question", back_populates="session")
    hunt = relationship("Hunt", back_populates="session")
    
