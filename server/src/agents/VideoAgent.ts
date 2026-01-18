import { LLMClient } from "./LLMClient";
import fs from 'fs';
import path from 'path';

export interface StoryboardItem {
    id: number;
    visual_prompt: string;
    narration: string;
    image_url?: string;
}

export class VideoAgent {
    private llmClient: LLMClient;
    private hfToken: string;

    constructor(llmClient: LLMClient) {
        this.llmClient = llmClient;
        this.hfToken = process.env.HUGGING_FACE_API_KEY || "";
    }

    async generateStoryboard(topic: string, objectives: string[]): Promise<StoryboardItem[]> {
        // 1. Defined Scenes (Intro + 3 Body + Outro)
        // We will generate images for ALL of them now to make it "better"

        const intro: StoryboardItem = {
            id: 1,
            visual_prompt: `High quality cinematic title card for a lesson on "${topic}". Futuristic, glowing neon typography, dark background, 8k resolution, educational.`,
            narration: `Welcome to this lesson on ${topic}. Let's dive in!`
        };

        const outro: StoryboardItem = {
            id: 10, // Intro (1) + Body (8) + Outro (1) = 10
            visual_prompt: "A beautiful educational summary screen with a gold trophy icon and text 'Lesson Complete'. Clean, modern, 3d render.",
            narration: "Great job! You've completed this lesson. Check out the quiz next!"
        };

        const prompt = `
Create 8 distinct educational scenes to explain these objectives:
${objectives.map(o => `- ${o}`).join('\n')}

Format as JSON array of objects: { "visual_prompt": "highly detailed visual description for image generation", "narration": "short explanation" }.
Keep narrations under 2 sentences. Ensure visual_prompts are descriptive.
`;

        let scenes: StoryboardItem[] = [];

        try {
            // Get Body Scenes from LLM
            const responseText = await this.llmClient.generateText(prompt);
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedBody = JSON.parse(cleanJson);

            const bodyScenes = parsedBody.map((item: any, index: number) => ({
                id: index + 2,
                visual_prompt: item.visual_prompt,
                narration: item.narration
            }));

            // Combine all scenes: Intro + Body + Outro
            scenes = [intro, ...bodyScenes, outro];

            // Generate Images for ALL scenes in parallel
            console.log(`[VideoAgent] Generating images for ${scenes.length} scenes...`);
            scenes = await Promise.all(scenes.map(async (scene) => {
                const imageUrl = await this.generateImage(scene.visual_prompt, scene.id);
                return { ...scene, image_url: imageUrl };
            }));

        } catch (err) {
            console.error("[VideoAgent] Generation failed:", err);
            // Fallback
            return [intro, outro];
        }

        return scenes;
    }

    private async generateImage(prompt: string, index: number): Promise<string | undefined> {
        if (!this.hfToken) return undefined;

        console.log(`[VideoAgent] Generating image for: "${prompt.slice(0, 30)}..."`);
        const model = "stabilityai/stable-diffusion-xl-base-1.0";
        try {
            const response = await fetch(
                `https://api-inference.huggingface.co/models/${model}`,
                {
                    headers: { Authorization: `Bearer ${this.hfToken}` },
                    method: "POST",
                    body: JSON.stringify({ inputs: prompt }),
                }
            );

            if (!response.ok) {
                console.error(`[VideoAgent] HF Error: ${response.status} ${response.statusText}`);
                return undefined;
            }

            const buffer = await response.arrayBuffer();

            const uniqueId = Date.now() + Math.random().toString(36).substring(7);
            const filename = `scene_${uniqueId}.jpg`;

            // Fix: Path relative to server/src/agents
            // src/agents -> src -> server -> Neurobots -> client -> public -> generated_images
            // ../../../client
            const outputDir = path.join(__dirname, '../../../client/public/generated_images');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const outputPath = path.join(outputDir, filename);
            fs.writeFileSync(outputPath, Buffer.from(buffer));

            console.log(`[VideoAgent] Image saved to ${outputPath}`);
            return `/generated_images/${filename}`;

        } catch (error) {
            console.error("[VideoAgent] Image Gen Failed:", error);
            return undefined;
        }
    }
}
