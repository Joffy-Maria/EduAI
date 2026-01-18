from ..models import ReasoningContext, LessonPlan

class ChemistryReasoningAgent:
    def reason(self, plan: LessonPlan) -> ReasoningContext:
        print("[ChemistryAgent] Reasoning about chemical interactions...")
        
        constraints = [
            "Atom conservation enforced",
            "Charge balance enforced",
            "Stoichiometric ratios validated"
        ]
        
        steps = [
            "Balance the chemical equation",
            "Calculate molar masses",
            "Determine limiting reagent"
        ]
        
        return ReasoningContext(
            plan=plan,
            constraints=constraints,
            steps=steps,
            assumptions=["STP conditions unless stated otherwise", "Ideal gas behavior"],
            raw_content={"reaction": "2H2 + O2 -> 2H2O"}
        )
