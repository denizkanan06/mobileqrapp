# app/main.py
from fastapi import FastAPI
from app.database import engine, Base
# Import models so SQLAlchemy can recognize and create the tables
from app.models import models
# Import the events router
from app.routers import events

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Start-Hub Event API", version="1.0.0")

# Include the event router in the main application
app.include_router(events.router) 

@app.get("/")
def read_root():
    return {"message": "Backend successfully running! Great job."}