import express from 'express';
import { Orchestrator } from '../agents/Orchestrator';
import Lesson from '../models/Lesson';

const router = express.Router();

// Initialize orchestrator with provider from env or default
const provider = process.env.LLM_PROVIDER || "mock";
const orchestrator = new Orchestrator(provider);

router.post('/generate', async (req, res) => {
    try {
        const { topic, userId } = req.body; // userId could be from JWT middleware
        console.log(`[API] Received generation request for: ${topic}`);

        const lesson = await orchestrator.processRequest(topic);
        res.status(201).json(lesson);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) { res.status(404).json({ message: 'Lesson not found' }); return; }
        res.json(lesson);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Chat with Lesson
router.post('/chat', async (req, res) => {
    try {
        const { lessonId, message, history } = req.body;

        // Fetch lesson content for context
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const reply = await orchestrator.chat(lesson.content, message, history || []);
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Chat failed" });
    }
});

export default router;
