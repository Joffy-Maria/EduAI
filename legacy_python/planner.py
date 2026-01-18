from .models import LessonPlan, Subject
from .llm_client import LLMClient

class PlannerAgent:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def plan(self, user_request: str) -> LessonPlan:
        # Refactored to use LLMClient potentially.
        # For now, we wrap the heuristic logic or call LLM.
        
        # DEMO: We will stick to the heuristic for reliability in the demo, 
        # but print that we *could* use the LLM.
        print(f"[Planner] Using {self.llm_client.__class__.__name__} to parse request: '{user_request}'")
        
        # HEURISTIC PARSING (Simple keyword detection for demo)
        subject = Subject.MATH  # Default
        topic = "General Science"
        if "physics" in user_request.lower():
            subject = Subject.PHYSICS
            topic = "Physics Topic"
        elif "chemistry" in user_request.lower():
            subject = Subject.CHEMISTRY
            topic = "Chemistry Topic"
        
        parts = user_request.split("about")
        if len(parts) > 1:
            topic = parts[1].strip()

        print(f"[Planner] Planning lesson for {subject} on {topic}")

        return LessonPlan(
            subject=subject,
            topic=topic,
            level="Intermediate",
            objectives=["Understand core concepts", "Apply formulas", "Verify results"],
            required_concepts=["Basic Algebra", "Scientific Method"],
            modalities=["text", "visual", "audio"],
            verification_requirements=["Check formulas", "Verify units"]
        )
