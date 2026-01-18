import { LLMClient } from "./LLMClient";

export class AudioAgent {
    private llmClient: LLMClient;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
    }

    async generateScript(lessonContent: string, topic: string): Promise<string> {
        const prompt = `
You are an expert educational podcaster. Your goal is to convert a written lesson into an engaging, conversational audio script.

TOPIC: ${topic}
LESSON CONTENT:
"""
${lessonContent.substring(0, 5000)} ...
"""

INSTRUCTIONS:
- Write a monologue script for a single host named "Neuro".
- Keep it under 5 minutes speaking time (approx 500-700 words).
- Use a friendly, enthusiastic, and clear tone.
- Start with a catchy hook: "Welcome back to Neurobots! Today we're exploring..."
- Simplify complex text into spoken language.
- Use rhetorical questions to keep the listener engaged.
- End with an inspiring closing thought.
- Return ONLY the script text. Do not include "Host:" prefixes or stage directions.

SCRIPT:
`;
        return await this.llmClient.generateText(prompt);
    }
}
