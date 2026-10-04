import logging
from sqlalchemy.orm import Session
from app.models.models import Document, Analysis, Requirement, ActionItem, Risk, Question, Evidence
from app.services.document_service import DocumentService
from app.services.gemma_service import GemmaService

logger = logging.getLogger("contextlens.analysis_service")

class AnalysisService:
    @staticmethod
    def process_and_analyze_document(db: Session, document_id: str) -> Analysis:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document with ID {document_id} not found")

        try:
            document.processing_status = "processing"
            db.commit()

            # 1. Extract text and page structures
            pages = DocumentService.extract_text_pages(document.file_path, document.file_type)

            # 2. Store Evidence records for each page
            # Remove previous evidence if any
            db.query(Evidence).filter(Evidence.document_id == document.id).delete()
            for page in pages:
                evidence = Evidence(
                    document_id=document.id,
                    page_number=page.get("page"),
                    text=page.get("text", "")
                )
                db.add(evidence)

            # 3. Perform Gemma AI analysis
            raw_analysis = GemmaService.analyze_document_content(pages, document.filename)

            # 4. Remove previous analysis if re-analyzing
            existing_analysis = db.query(Analysis).filter(Analysis.document_id == document.id).first()
            if existing_analysis:
                db.delete(existing_analysis)
                db.flush()

            # 5. Create Analysis record
            analysis = Analysis(
                document_id=document.id,
                summary=raw_analysis.get("summary", "Analysis completed.")
            )
            db.add(analysis)
            db.flush()  # Generate analysis.id

            # 6. Add Requirements
            for req in raw_analysis.get("requirements", []):
                requirement = Requirement(
                    analysis_id=analysis.id,
                    title=req.get("title", "Requirement"),
                    description=req.get("description", ""),
                    source_reference=req.get("source_reference")
                )
                db.add(requirement)

            # 7. Add ActionItems
            for act in raw_analysis.get("actions", []):
                action = ActionItem(
                    analysis_id=analysis.id,
                    title=act.get("title", "Action Item"),
                    description=act.get("description", ""),
                    priority=act.get("priority", "medium"),
                    deadline=act.get("deadline"),
                    completed=False,
                    source_reference=act.get("source_reference")
                )
                db.add(action)

            # 8. Add Risks
            for rk in raw_analysis.get("risks", []):
                risk = Risk(
                    analysis_id=analysis.id,
                    description=rk.get("description", ""),
                    severity=rk.get("severity", "medium"),
                    source_reference=rk.get("source_reference")
                )
                db.add(risk)

            # 9. Add Questions
            for q in raw_analysis.get("questions", []):
                question = Question(
                    analysis_id=analysis.id,
                    question=q.get("question", ""),
                    source_reference=q.get("source_reference")
                )
                db.add(question)

            document.processing_status = "completed"
            db.commit()
            db.refresh(analysis)
            return analysis

        except Exception as e:
            db.rollback()
            document.processing_status = "failed"
            document.error_message = str(e)
            db.commit()
            logger.error(f"Error processing document {document_id}: {str(e)}", exc_info=True)
            raise e
