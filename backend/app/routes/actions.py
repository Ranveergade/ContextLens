from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import ActionItem, Analysis, Evidence
from app.schemas.schemas import ActionItemResponse, ActionItemUpdate, SourceReference

router = APIRouter(prefix="/actions", tags=["actions"])

@router.patch("/{action_id}", response_model=ActionItemResponse)
def update_action_item(
    action_id: str,
    action_update: ActionItemUpdate,
    db: Session = Depends(get_db)
):
    action = db.query(ActionItem).filter(ActionItem.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")
    
    update_data = action_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(action, field, value)
        
    db.commit()
    db.refresh(action)
    return action


@router.get("/{action_id}/evidence", response_model=SourceReference)
def get_action_evidence(
    action_id: str,
    db: Session = Depends(get_db)
):
    action = db.query(ActionItem).filter(ActionItem.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")
    
    if action.source_reference:
        return SourceReference(**action.source_reference)
    
    # If source_reference is missing on action item, attempt to locate matching page text from Document Evidence
    analysis = db.query(Analysis).filter(Analysis.id == action.analysis_id).first()
    if analysis:
        evidence = db.query(Evidence).filter(Evidence.document_id == analysis.document_id).first()
        if evidence:
            return SourceReference(page=evidence.page_number or 1, text=evidence.text[:300])
            
    return SourceReference(page=1, text="Source evidence text snippet unavailable for this item.")
