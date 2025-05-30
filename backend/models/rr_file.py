from sqlalchemy import Column, Integer, String, Boolean, Date, Time, Double, ForeignKey

from db.base import Base


class RRFile(Base):
    __tablename__ = "rr_file"

    id = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String, nullable=True)

    session_id = Column(Integer, ForeignKey("session.id"))
