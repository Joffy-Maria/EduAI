import enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Subject(str, enum.Enum):
    MATH = "Mathematics"
    PHYSICS = "Physics"
    CHEMISTRY = "Chemistry"

class LessonPlan(BaseModel):
    subject: Subject
    topic: str
    level: str
    objectives: List[str]
    required_concepts: List[str]
    modalities: List[str]
    verification_requirements: List[str]

class ReasoningContext(BaseModel):
    plan: LessonPlan
    constraints: List[str]
    steps: List[str]
    assumptions: List[str]
    raw_content: Dict[str, Any]

class DraftContent(BaseModel):
    plan: LessonPlan
    content_text: str
    sections: Dict[str, str]  # e.g., "objectives", "explanation", "example"
    modality_specs: Dict[str, Any]

class VerificationResult(BaseModel):
    status: str  # "verified" | "failed"
    checks_passed: List[str]
    checks_failed: List[str]
    feedback: Optional[str] = None

class MultimodalAssets(BaseModel):
    visuals: List[Dict[str, Any]]
    audio_script: str
    video_storyboard: List[Dict[str, Any]]

class FinalResponse(BaseModel):
    lesson_text: str
    assets: MultimodalAssets
    verification_log: VerificationResult
