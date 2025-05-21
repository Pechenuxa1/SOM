from sqlalchemy import Column, Integer, String, Boolean, Date, Time

from db.base import Base


class Subject(Base):
    __tablename__ = "subject"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject = Column(String, nullable=False)
    sex = Column(String, nullable=True)
    foreign = Column(Boolean, nullable=True)
    birth_date = Column(Date, nullable=True)
