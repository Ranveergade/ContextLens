from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.core.config import settings
from app.db.database import init_db
from app.routes import documents, actions

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("contextlens")

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ContextLens: AI Document Understanding & Traceable Actionable Workspace"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database tables
@app.on_event("startup")
def startup_event():
    logger.info("Initializing ContextLens Database...")
    init_db()
    logger.info("Database initialized successfully.")

# Mount Uploads directory for static file access
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(actions.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "tagline": "Understand everything. Act on what matters.",
        "version": settings.VERSION,
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ContextLens API"}
