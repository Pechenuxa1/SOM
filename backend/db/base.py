import os
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine, MetaData
from dotenv import load_dotenv
from sqlalchemy.orm import declarative_base, sessionmaker, Session

load_dotenv()

engine = create_engine(os.environ.get("POSTGRES_URL"))
metadata = MetaData()
Base = declarative_base(metadata=metadata)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
