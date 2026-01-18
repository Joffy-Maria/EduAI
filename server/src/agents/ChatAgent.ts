import { LLMClient } from "./LLMClient";

export class ChatAgent {
    private llmClient: LLMClient;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
    }

    async chat(lessonContext: string, userMessage: string, history: { role: string, content: string }[]): Promise<string> {
        // Construct a prompt with context and history
        const historyText = history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n');

        const prompt = `
You are a helpful and encouraging AI Tutor. Your goal is to help a student understand a specific lesson.

CONTEXT (The lesson the student is reading):
"""
${lessonContext.substring(0, 5000)} ... (truncated if too long)
"""

CONVERSATION HISTORY:
${historyText}

STUDENT QUESTION:
${userMessage}

INSTRUCTIONS:
- Answer the student's question directly using the provided context.
- Be encouraging and concise.
- If the answer is not in the context, use your general knowledge but mention that it's outside the current lesson scope.
- Do not make up facts.

RESPONSE:
`;

        return await this.llmClient.generateText(prompt);
    }
}
