import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
    topic: string;
    subject: string;
    content: string; // Markdown content
    assets: {
        visuals: any[];
        audio_script: string;
        video_storyboard: any[];
    };
    verification_log: {
        status: string;
        checks_passed: string[];
        checks_failed: string[];
    };
    createdAt: Date;
}

const LessonSchema: Schema = new Schema({
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    assets: {
        visuals: [],
        audio_script: String,
        video_storyboard: []
    },
    verification_log: {
        status: String,
        checks_passed: [String],
        checks_failed: [String]
    },
}, { timestamps: true });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
