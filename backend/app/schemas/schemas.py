from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class SourceReference(BaseModel):
    page: Optional[int] = None
    text: Optional[str] = None
    context: Optional[str] = None

# Base Schemas
class RequirementBase(BaseModel):
    title: str
    description: str
    source_reference: Optional[SourceReference] = None

class RequirementResponse(RequirementBase):
    id: str
    analysis_id: str

    class Config:
        from_attributes = True


class ActionItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"  # high, medium, low
    deadline: Optional[str] = None
    source_reference: Optional[SourceReference] = None

class ActionItemUpdate(BaseModel):
    completed: Optional[bool] = None
    priority: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None

class ActionItemResponse(ActionItemBase):
    id: str
    analysis_id: str
    completed: bool

    class Config:
        from_attributes = True


class RiskBase(BaseModel):
    description: str
    severity: str = "medium"  # high, medium, low
    source_reference: Optional[SourceReference] = None

class RiskResponse(RiskBase):
    id: str
    analysis_id: str

    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    question: str
    source_reference: Optional[SourceReference] = None

class QuestionResponse(QuestionBase):
    id: str
    analysis_id: str

    class Config:
        from_attributes = True


class EvidenceResponse(BaseModel):
    id: str
    document_id: str
    text: str
    page_number: Optional[int] = None
    location_info: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class AnalysisResponse(BaseModel):
    id: str
    document_id: str
    summary: str
    created_at: datetime
    requirements: List[RequirementResponse] = []
    action_items: List[ActionItemResponse] = []
    risks: List[RiskResponse] = []
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_bytes: Optional[int] = None
    created_at: datetime
    processing_status: str
    error_message: Optional[str] = None

    class Config:
        from_attributes = True


class DocumentDetailResponse(DocumentResponse):
    analysis: Optional[AnalysisResponse] = None

    class Config:
        from_attributes = True


# Schema for raw Gemma AI output validation
class GemmaSourceRef(BaseModel):
    page: Optional[int] = None
    text: str = ""

class GemmaRequirementItem(BaseModel):
    title: str
    description: str
    source_reference: Optional[GemmaSourceRef] = None

class GemmaActionItem(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"
    deadline: Optional[str] = None
    source_reference: Optional[GemmaSourceRef] = None

class GemmaRiskItem(BaseModel):
    description: str
    severity: str = "medium"
    source_reference: Optional[GemmaSourceRef] = None

class GemmaQuestionItem(BaseModel):
    question: str
    source_reference: Optional[GemmaSourceRef] = None

class GemmaAnalysisOutput(BaseModel):
    summary: str
    requirements: List[GemmaRequirementItem] = []
    actions: List[GemmaActionItem] = []
    deadlines: List[Dict[str, Any]] = []
    deliverables: List[Dict[str, Any]] = []
    risks: List[GemmaRiskItem] = []
    questions: List[GemmaQuestionItem] = []
