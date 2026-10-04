from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from app.db.database import get_db
from app.models.models import Document, Analysis, ActionItem, Evidence
from app.schemas.schemas import (
    DocumentResponse,
    DocumentDetailResponse,
    AnalysisResponse,
    ActionItemResponse
)
from app.services.document_service import DocumentService, DocumentProcessingError
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        file_size = len(content)
        
        file_ext = DocumentService.validate_file(file.filename, file_size, file.content_type)
        safe_filename, file_path, _ = DocumentService.save_uploaded_file(content, file.filename)
        
        doc = Document(
            filename=file.filename,
            file_type=file_ext.replace(".", "").upper(),
            file_path=file_path,
            file_size_bytes=file_size,
            processing_status="pending"
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        return doc
    except DocumentProcessingError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Upload failed: {str(e)}")


@router.get("", response_model=List[DocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc


@router.get("/{document_id}/text")
def get_document_extracted_text(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    try:
        pages = DocumentService.extract_text_pages(doc.file_path, doc.file_type)
        full_text_blocks = []
        for p in pages:
            full_text_blocks.append(f"--- PAGE {p.get('page', 1)} ---\n{p.get('text', '')}")
            
        return {
            "document_id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "full_text": "\n\n".join(full_text_blocks),
            "pages": pages
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to extract document text: {str(e)}")


@router.post("/{document_id}/analyze", response_model=AnalysisResponse)
def analyze_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    try:
        analysis = AnalysisService.process_and_analyze_document(db, document_id)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/{document_id}/analysis", response_model=AnalysisResponse)
def get_document_analysis(document_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.document_id == document_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found for this document. Please trigger /analyze first."
        )
    return analysis


@router.get("/{document_id}/actions", response_model=List[ActionItemResponse])
def get_document_actions(document_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.document_id == document_id).first()
    if not analysis:
        return []
    return db.query(ActionItem).filter(ActionItem.analysis_id == analysis.id).all()


@router.get("/{document_id}/file")
def get_document_file(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    media_type = "application/pdf" if doc.file_type == "PDF" else "text/plain"
    return FileResponse(doc.file_path, media_type=media_type, filename=doc.filename)
