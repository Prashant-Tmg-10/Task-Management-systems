from fastapi import FastAPI
from src.utils.db import Base, engine
#from src.tasks.models import TaskModel
from src.tasks.router import task_routes
from src.user.router import user_routes
from fastapi.middleware.cors import CORSMiddleware
from src.utils.settings import settings


Base.metadata.create_all(bind=engine)

app=FastAPI(title="This is my Task Management System")
app.include_router(task_routes)
app.include_router(user_routes)

frontend_origins = [
    origin.strip()
    for origin in settings.FRONTEND_URL.split(",")
    if origin.strip()
]

# Allow frontend (React) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

