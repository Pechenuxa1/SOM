from fastapi import APIRouter, Depends, FastAPI, Path, Query, status
from sqlalchemy.orm import Session
from models.question import Question
from models.session import Session as ModelSession

from db.base import get_session
from sqlalchemy import case, distinct, func, select

from models.subject import Subject
from schemas.question_schema import ListQuestionResponse, QuestionResponse


test_columns = [
    Question.is_fill_sp_after,
    Question.is_fill_sp_before,
    Question.is_fill_bdi,
    Question.is_fill_gld,
    Question.is_fill_st,
    Question.is_fill_scs,
    Question.is_fill_sfa
]

false_counts = [
    case((col == False, 1), else_=0) for col in test_columns
]


def get_questions_by_survey_number_id(
    survey_number_id: int = Path(), 
    sort: bool = Query(False), 
    db: Session = Depends(get_session)
):
    sessions_with_questions = db.execute(
        select(ModelSession, Question)
        .outerjoin(Question)
        .filter(ModelSession.survey_number_id == survey_number_id)
    ).all()

    result_questions = []
    
    for session, question in sessions_with_questions:
        if question is None:
            question = QuestionResponse()
            question.subject = db.execute(select(Subject.subject).join(ModelSession, Subject.id == ModelSession.subject_id).filter(ModelSession.id == session.id)).scalar()
            question.sp_before = False
            question.sp_after = False
            question.st = False
            question.scs = False
            question.sfa = False
            question.gld = False
            question.bdi = False
        else:
            question.subject = db.execute(select(Subject.subject).join(ModelSession, Subject.id == ModelSession.subject_id).filter(ModelSession.question_id == question.id)).scalar()
            question.sp_before = question.is_fill_sp_before
            question.sp_after = question.is_fill_sp_after
            question.st = question.is_fill_st
            question.scs = question.is_fill_scs
            question.sfa = question.is_fill_sfa
            question.gld = question.is_fill_gld
            question.bdi = question.is_fill_bdi
        
        result_questions.append(question)

    if sort:
        result_questions.sort(
            key=lambda q: sum([
                not q.sp_before,
                not q.sp_after,
                not q.st,
                not q.scs,
                not q.sfa,
                not q.gld,
                not q.bdi
            ]),
            reverse=True
        )
    else:
        result_questions.sort(
            key=lambda q: q.subject or "",
            reverse=False
        )

    return ListQuestionResponse(questions=result_questions)
