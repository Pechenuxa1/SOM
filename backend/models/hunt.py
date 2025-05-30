from sqlalchemy import Column, Integer, String, Boolean, Date, Time, Double, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class Hunt(Base):
    __tablename__ = "hunt"

    id = Column(Integer, primary_key=True, autoincrement=True)
    is_fill = Column(Boolean, nullable=True)
    path = Column(String, nullable=True)

    session = relationship("Session", back_populates="hunt")

