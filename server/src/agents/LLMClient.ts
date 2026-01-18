import dotenv from 'dotenv';
dotenv.config();

export interface LLMClient {
    generateText(prompt: string, systemInstruction?: string): Promise<string>;
}

export class MockLLM implements LLMClient {
    async generateText(prompt: string, systemInstruction?: string): Promise<string> {
        return `[MOCK RESPONSE] Processed: ${prompt.slice(0, 50)}...`;
    }
}

export class OpenAILLM implements LLMClient {
    private apiKey: string;
    private model: string;

    constructor(apiKey?: string, model: string = "gpt-4o") {
        this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
        this.model = model;
        if (!this.apiKey) console.warn("Warning: No OpenAI API key provided.");
    }

    async generateText(prompt: string, systemInstruction?: string): Promise<string> {
        // Placeholder implementation (requires 'openai' npm package)
        // import OpenAI from 'openai';
        // const client = new OpenAI({ apiKey: this.apiKey });
        // ...
        return `[OpenAI] (Simulated TS) response to: ${prompt.slice(0, 20)}`;
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiLLM implements LLMClient {
    private apiKey: string;
    private modelName: string;
    private client: GoogleGenerativeAI;

    constructor(apiKey?: string, model: string = "gemini-2.5-flash") {
        this.apiKey = apiKey || process.env.GOOGLE_API_KEY || "";
        this.modelName = model;

        if (!this.apiKey) {
            console.warn("Warning: No Google API key provided.");
        }

        this.client = new GoogleGenerativeAI(this.apiKey);
    }

    async generateText(prompt: string, systemInstruction?: string): Promise<string> {
        let retries = 3;
        let delay = 2000; // Start with 2s delay

        while (retries > 0) {
            try {
                const model = this.client.getGenerativeModel({
                    model: this.modelName,
                    systemInstruction: systemInstruction
                });

                console.log(`[Gemini] Sending request to ${this.modelName}: ${prompt.slice(0, 50)}...`);
                const result = await model.generateContent(prompt);
                const response = result.response;
                const text = response.text();

                console.log(`[Gemini] Received response: ${text.slice(0, 50)}...`);
                return text;
            } catch (error: any) {
                if ((error.message.includes('429') || error.message.includes('quota')) && retries > 1) {
                    console.warn(`[Gemini] Rate limit hit. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                    retries--;
                } else {
                    console.error("[Gemini] Error generating content:", error);
                    // Throw error so PlannerAgent can handle it
                    throw new Error(`[Error] Failed to generate content: ${error.message}`);
                }
            }
        }
        throw new Error(`[Error] Failed to generate content after retries.`);
    }

    // Removed _generate private method
}
