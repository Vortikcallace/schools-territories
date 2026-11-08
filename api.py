import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "/app/database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            teacher_name TEXT,
            question TEXT,
            answer TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            status TEXT,
            errors INTEGER
        )
    """)
    conn.commit()
    conn.close()

init_db()

class TaskItem(BaseModel):
    question: str
    answer: str

class TasksPayload(BaseModel):
    teacher_name: str
    tasks: list[TaskItem]

class StatItem(BaseModel):
    student: str
    status: str
    errors: int

@app.post("/api/tasks")
def save_tasks(payload: TasksPayload):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    for t in payload.tasks:
        cursor.execute(
            "INSERT INTO tasks (teacher_name, question, answer) VALUES (?, ?, ?)",
            (payload.teacher_name, t.question, t.answer)
        )
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.get("/api/tasks")
def get_tasks():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT question, answer FROM tasks")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"tasks": []}

    tasks = [{"question": row[0], "answer": row[1]} for row in rows]
    return {"tasks": tasks}

@app.post("/api/stats")
def save_stat(stat: StatItem):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO stats (student_name, status, errors) VALUES (?, ?, ?)",
        (stat.student, stat.status, stat.errors)
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.get("/api/stats")
def get_stats():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT student_name, status, errors FROM stats ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    stats = [{"student": row[0], "status": row[1], "errors": row[2]} for row in rows]
    return {"stats": stats}

app.mount("/", StaticFiles(directory="app", html=True), name="app")
