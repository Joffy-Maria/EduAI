import { LLMClient } from './LLMClient';
import { ReasoningContext } from './ReasoningAgent';

export interface DraftContent {
    plan: any;
    content_text: string;
    sections: { [key: string]: string };
}

export class ContentGenerationAgent {
    private llmClient: LLMClient;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
    }

    async generate(context: ReasoningContext): Promise<DraftContent> {
        console.log(`[ContentAgent] Generating content for ${context.plan.topic}...`);

        const prompt = `Generate a lesson for ${context.plan.topic}. Constraints: ${context.constraints.join(', ')}`;
        const response = await this.llmClient.generateText(prompt);

        // Simulated structured parsing since we don't have a real heavy LLM connected in this mock
        const contentText = `# ${context.plan.topic}\n\n## Objectives\n${context.plan.objectives.join('\n- ')}\n\n## Content\n${response}`;

        return {
            plan: context.plan,
            content_text: contentText,
            sections: {
                intro: "Introduction...",
                body: response,
                conclusion: "Summary..."
            }
        };
    }
}
