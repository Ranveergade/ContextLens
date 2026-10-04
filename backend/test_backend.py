import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.database import init_db, SessionLocal
from app.main import app
from app.models.models import Document, Analysis

def test_init():
    print("Testing database initialization...")
    init_db()
    db = SessionLocal()
    doc_count = db.query(Document).count()
    print(f"Database connected successfully. Document count: {doc_count}")
    db.close()
    print("FastAPI app routes registered:")
    for route in app.routes:
        print(f"  {getattr(route, 'methods', ['GET'])} {route.path}")
    print("ALL BACKEND CHECKS PASSED!")

if __name__ == "__main__":
    test_init()
