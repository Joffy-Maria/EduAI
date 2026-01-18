from ..models import ReasoningContext, LessonPlan

class PhysicsReasoningAgent:
    def reason(self, plan: LessonPlan) -> ReasoningContext:
        print("[PhysicsAgent] Reasoning about physical laws...")
        
        constraints = [
            "Dimensional consistency required",
            "SI units enforced",
            "Physical assumptions must be stated"
        ]
        
        steps = [
            "Identify the physical system and forces",
            "Apply Newton's Laws or Conservation Principles",
            "Check units at each step"
        ]
        
        return ReasoningContext(
            plan=plan,
            constraints=constraints,
            steps=steps,
            assumptions=["Neglect air resistance", "Gravity is constant 9.81 m/s^2"],
            raw_content={"key_law": "F = ma", "energy": "E = mc^2"}
        )
