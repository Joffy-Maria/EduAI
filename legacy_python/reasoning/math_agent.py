from ..models import ReasoningContext, LessonPlan

class MathReasoningAgent:
    def reason(self, plan: LessonPlan) -> ReasoningContext:
        print("[MathAgent] Reasoning about mathematical concepts...")
        
        # Inject constraints
        constraints = [
            "Symbolic reasoning preferred",
            "Step-by-step derivations required",
            "No unexplained algebraic transformations"
        ]
        
        # Simulated reasoning steps
        steps = [
            f"Define variables for {plan.topic}",
            "Formulate equations based on standard axioms",
            "Solve for unknown variables step-by-step"
        ]
        
        return ReasoningContext(
            plan=plan,
            constraints=constraints,
            steps=steps,
            assumptions=["Standard Euclidean geometry applies"],
            raw_content={"key_formula": "x = (-b +/- sqrt(b^2 - 4ac)) / 2a"}
        )
