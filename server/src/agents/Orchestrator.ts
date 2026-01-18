import { LLMClient, MockLLM, OpenAILLM, GeminiLLM } from './LLMClient';
import { PlannerAgent } from './PlannerAgent';
import { MathReasoningAgent, PhysicsReasoningAgent, ChemistryReasoningAgent, ReasoningAgent } from './ReasoningAgent';
import { ContentGenerationAgent } from './ContentGenerationAgent';
import { VerificationAgent } from './VerificationAgent';
import { ChatAgent } from './ChatAgent';
import { AudioAgent } from './AudioAgent';
import { VideoAgent } from './VideoAgent';
import Lesson from '../models/Lesson';

export class Orchestrator {
    private llmClient: LLMClient;
    private planner: PlannerAgent;
    private contentAgent: ContentGenerationAgent;
    private verificationAgent: VerificationAgent;
    private chatAgent: ChatAgent;
    private audioAgent: AudioAgent;
    private videoAgent: VideoAgent;

    constructor(provider: string = "mock") {
        if (provider === "openai") this.llmClient = new OpenAILLM();
        else if (provider === "gemini") this.llmClient = new GeminiLLM();
        else this.llmClient = new MockLLM();

        this.planner = new PlannerAgent(this.llmClient);
        this.contentAgent = new ContentGenerationAgent(this.llmClient);
        this.verificationAgent = new VerificationAgent(this.llmClient);
        this.chatAgent = new ChatAgent(this.llmClient);
        this.audioAgent = new AudioAgent(this.llmClient);
        this.videoAgent = new VideoAgent(this.llmClient);
    }

    async processRequest(userRequest: string, subjectOverride?: string) {
        console.log(`[Orchestrator] Processing: ${userRequest}`);

        // 1. Plan
        const plan = await this.planner.plan(userRequest);

        // 2. Reason
        let reasoningAgent: ReasoningAgent;
        if (plan.subject === "Physics") reasoningAgent = new PhysicsReasoningAgent();
        else if (plan.subject === "Chemistry") reasoningAgent = new ChemistryReasoningAgent();
        else reasoningAgent = new MathReasoningAgent();

        const context = await reasoningAgent.reason(plan);

        // 3. Generate & Verify
        // (Simplified loop for now)
        const draft = await this.contentAgent.generate(context);
        const verification = await this.verificationAgent.verify(draft);

        if (verification.status === "failed") {
            throw new Error("Verification failed: " + verification.checks_failed.join(", "));
        }

        // 4. Generate Assets
        // Audio (Full content) - Be careful with tokens here, maybe optimize later too?
        console.log('[Orchestrator] Generating audio script...');
        const audioScript = await this.audioAgent.generateScript(draft.content_text, plan.topic);

        // Video (Optimized Plan)
        console.log('[Orchestrator] Generating video storyboard...');
        const storyboard = await this.videoAgent.generateStoryboard(plan.topic, plan.objectives);

        // 5. Save to DB
        const lesson = new Lesson({
            topic: plan.topic,
            subject: plan.subject,
            content: draft.content_text,
            verification_log: verification,
            assets: { visuals: [], audio_script: audioScript, video_storyboard: storyboard }
        });

        await lesson.save();
        console.log(`[Orchestrator] Lesson saved: ${lesson._id}`);

        return lesson;
    }

    async chat(lessonContext: string, userMessage: string, history: any[]) {
        return await this.chatAgent.chat(lessonContext, userMessage, history);
    }
}
