import { LessonPlan } from './PlannerAgent';

export interface ReasoningContext {
    plan: LessonPlan;
    constraints: string[];
    steps: string[];
    assumptions: string[];
}

export abstract class ReasoningAgent {
    abstract reason(plan: LessonPlan): Promise<ReasoningContext>;
}

export class MathReasoningAgent extends ReasoningAgent {
    async reason(plan: LessonPlan): Promise<ReasoningContext> {
        console.log("[MathAgent] Reasoning...");
        return {
            plan,
            constraints: ["Symbolic reasoning preferred", "Step-by-step derivations"],
            steps: ["Define variables", "Formulate equations", "Solve"],
            assumptions: ["Euclidean geometry"]
        };
    }
}

export class PhysicsReasoningAgent extends ReasoningAgent {
    async reason(plan: LessonPlan): Promise<ReasoningContext> {
        console.log("[PhysicsAgent] Reasoning...");
        return {
            plan,
            constraints: ["Dimensional consistency", "SI units"],
            steps: ["Identify forces", "Apply Newton's Laws"],
            assumptions: ["Neglect air resistance"]
        };
    }
}

export class ChemistryReasoningAgent extends ReasoningAgent {
    async reason(plan: LessonPlan): Promise<ReasoningContext> {
        console.log("[ChemistryAgent] Reasoning...");
        return {
            plan,
            constraints: ["Charge balance", "Stoichiometry"],
            steps: ["Balance equation", "Calculate moles"],
            assumptions: ["STP conditions"]
        };
    }
}
