from .models import LessonPlan, Subject

class DomainRouter:
    def route(self, plan: LessonPlan) -> str:
        # Route to the appropriate agent key based on subject
        print(f"[Router] Routing {plan.subject} to specific reasoning agent.")
        if plan.subject == Subject.MATH:
            return "MATH_AGENT"
        elif plan.subject == Subject.PHYSICS:
            return "PHYSICS_AGENT"
        elif plan.subject == Subject.CHEMISTRY:
            return "CHEMISTRY_AGENT"
        return "MATH_AGENT" # Fallback
