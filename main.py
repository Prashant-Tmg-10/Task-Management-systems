from fastapi import FastAPI
from src.utils.db import Base, engine
#from src.tasks.models import TaskModel
from src.tasks.router import task_routes
from src.user.router import user_routes
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app=FastAPI(title="This is my Task Management System")
app.include_router(task_routes)
app.include_router(user_routes)

# Allow frontend (React) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

