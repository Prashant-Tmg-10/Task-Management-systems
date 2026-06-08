from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.utils.db import Base, engine
from src.tasks.router import task_routes
from src.user.router import user_routes

# create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management System")

# =========================
# ROUTES
# =========================
app.include_router(task_routes)
app.include_router(user_routes)

# =========================
# CORS CONFIG (IMPORTANT)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://task-management-systems-five.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HEALTH CHECK (OPTIONAL BUT USEFUL)
# =========================
@app.get("/")
def home():
    return {
        "message": "Task Management API is running"
    }