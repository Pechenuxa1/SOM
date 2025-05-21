from fastapi import FastAPI
from som.api.subjects import router as subject_router
from som.api.sessions import router as session_router
from som.api.questions import router as question_router
from som.api.hunt import router as hunt_router
from som.api.files import router as file_router
from som.api.survey import router as survey_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(subject_router, prefix="/api/subjects")
app.include_router(session_router, prefix="/api/sessions")
app.include_router(question_router, prefix="/api/questions")
app.include_router(hunt_router, prefix="/api/hunt")
app.include_router(file_router, prefix="/api/files")
app.include_router(survey_router, prefix="/api/surveys")