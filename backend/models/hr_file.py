from sqlalchemy import Column, Integer, String, Boolean, Date, Time, Double, ForeignKey

from db.base import Base


class HRFile(Base):
    __tablename__ = "hr_file"

    id = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String, nullable=True)

    session_id = Column(Integer, ForeignKey("session.id"))
