import { LLMClient } from './LLMClient';

export interface LessonPlan {
    subject: string;
    topic: string;
    level: string;
    objectives: string[];
    required_concepts: string[];
    modalities: string[];
    verification_requirements: string[];
}

export class PlannerAgent {
    private llmClient: LLMClient;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
    }

    async plan(userRequest: string): Promise<LessonPlan> {
        console.log(`[Planner] Planning lesson for request: '${userRequest}'`);

        const systemInstruction = `You are an expert curriculum planner. Create a comprehensive lesson plan based on the user's request.
        Return ONLY a JSON object with the following structure:
        {
            "subject": "Subject Name (e.g. Physics, History)",
            "topic": "Specific Topic",
            "level": "Target Audience Level (e.g. High School, Undergraduate)",
            "objectives": ["List of learning objectives"],
            "required_concepts": ["Prerequisite concepts"],
            "modalities": ["text", "visual", "audio"],
            "verification_requirements": ["Criteria to verify the content accuracy"]
        }`;

        const prompt = `Create a lesson plan for: "${userRequest}"`;

        try {
            const responseText = await this.llmClient.generateText(prompt, systemInstruction);
            console.log(`[Planner] Raw LLM Response:`, responseText);

            // Check if any error occurred in LLMClient
            if (responseText.startsWith("[Error]")) {
                throw new Error(responseText);
            }

            // Clean up code blocks if present
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            const plan: LessonPlan = JSON.parse(cleanJson);
            return plan;
        } catch (error: any) {
            console.error("[Planner] Error generating plan:", error);
            // Pass the underlying error message up so we can see it in the UI/Logs
            throw new Error(`Failed to generate lesson plan: ${error.message || error}`);
        }
    }
}
