import { DraftContent } from './ContentGenerationAgent';
import { LLMClient } from './LLMClient';

export interface VerificationResult {
    status: "verified" | "failed";
    checks_passed: string[];
    checks_failed: string[];
}

export class VerificationAgent {
    private llmClient: LLMClient;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
    }

    async verify(content: DraftContent): Promise<VerificationResult> {
        console.log("[VerificationAgent] Verifying...");

        // Simulated verification
        const passed = ["Format check", "Safety check"];
        const failed: string[] = [];

        if (!content.content_text) {
            failed.push("Empty content");
            return { status: "failed", checks_passed: passed, checks_failed: failed };
        }

        return { status: "verified", checks_passed: passed, checks_failed: failed };
    }
}
