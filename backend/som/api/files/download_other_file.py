
from pathlib import Path
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from db.base import get_session
from sqlalchemy import select
from models.other_file import OtherFile
from mimetypes import guess_type


def download_other_file(other_file_id: int, db: Session = Depends(get_session)):
    other_file = db.execute(select(OtherFile).where(OtherFile.id == other_file_id)).scalar()   
    if not other_file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    file_path = Path(other_file.path)
    
    if not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not exists")
     
    media_type, _ = guess_type(other_file.path)
    return FileResponse(
        other_file.path, 
        media_type=media_type, 
        filename=file_path.name,
        headers={
            "Content-Disposition": f"attachment; filename={file_path.name}"
        }
    )