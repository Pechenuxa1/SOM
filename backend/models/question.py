from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String, nullable=True)

    is_fill_sp_before = Column(Boolean, nullable=True)
    is_fill_sp_after = Column(Boolean, nullable=True)
    is_fill_st = Column(Boolean, nullable=True)
    is_fill_scs = Column(Boolean, nullable=True)
    is_fill_sfa = Column(Boolean, nullable=True)
    is_fill_gld = Column(Boolean, nullable=True)
    is_fill_bdi = Column(Boolean, nullable=True)

    session = relationship("Session", back_populates="question")
