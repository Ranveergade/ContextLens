import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    processing_status = Column(String(50), default="pending") # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)

    analysis = relationship("Analysis", back_populates="document", uselist=False, cascade="all, delete-orphan")
    evidences = relationship("Evidence", back_populates="document", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="analysis")
    requirements = relationship("Requirement", back_populates="analysis", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="analysis", cascade="all, delete-orphan")
    risks = relationship("Risk", back_populates="analysis", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="analysis", cascade="all, delete-orphan")


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    source_reference = Column(JSON, nullable=True)  # {"page": 1, "text": "..."}

    analysis = relationship("Analysis", back_populates="requirements")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(20), default="medium")  # high, medium, low
    deadline = Column(String(100), nullable=True)
    completed = Column(Boolean, default=False)
    source_reference = Column(JSON, nullable=True)  # {"page": 1, "text": "..."}

    analysis = relationship("Analysis", back_populates="action_items")


class Risk(Base):
    __tablename__ = "risks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), default="medium")  # high, medium, low
    source_reference = Column(JSON, nullable=True)  # {"page": 1, "text": "..."}

    analysis = relationship("Analysis", back_populates="risks")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    source_reference = Column(JSON, nullable=True)  # {"page": 1, "text": "..."}

    analysis = relationship("Analysis", back_populates="questions")


class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    location_info = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="evidences")
