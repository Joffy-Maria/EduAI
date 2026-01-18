import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, AlertTriangle, BookOpen, Play, Image as ImageIcon, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function LessonPage() {
    const { id } = useParams();
    const [lesson, setLesson] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('content');

    // Chat State
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Video State
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        api.get(`/lessons/${id}`).then(res => setLesson(res.data)).catch(console.error);
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, activeTab]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const newMessage: Message = { role: 'user', content: chatInput };
        setChatHistory(prev => [...prev, newMessage]);
        setChatInput('');
        setChatLoading(true);

        try {
            const res = await api.post('/lessons/chat', {
                lessonId: id,
                message: newMessage.content,
                history: chatHistory
            });

            setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            console.error(err);
            // Optionally add error message to chat
        } finally {
            setChatLoading(false);
        }
    };

    if (!lesson) return <div className="text-center mt-20">Loading lesson...</div>;

    return (
        <div className="h-full overflow-y-auto w-full custom-scrollbar pb-20">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-20 w-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Metadata */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Verification Status</h3>
                        {lesson.verification_log?.status === 'verified' ? (
                            <div className="flex items-center text-green-400">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">Verified Valid</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-yellow-400">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                <span className="font-medium">Partial / Unverified</span>
                            </div>
                        )}
                        <div className="mt-4 space-y-2">
                            {lesson.verification_log?.checks_passed.map((check: string, i: number) => (
                                <div key={i} className="text-xs text-slate-500 flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                    {check}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Lesson Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subject</span>
                                <span className="text-white">{lesson.subject}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Topic</span>
                                <span className="text-white">{lesson.topic}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="glass-panel rounded-xl overflow-hidden min-h-[600px] flex flex-col">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                            {[
                                { id: 'content', icon: BookOpen, label: 'Text Content' },
                                { id: 'doubts', icon: MessageCircle, label: 'Doubts & Chat' },
                                { id: 'visuals', icon: ImageIcon, label: 'Visuals' },
                                { id: 'audio', icon: Play, label: 'Audio' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center ${activeTab === tab.id ? 'bg-slate-800/50 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 flex-1">
                            {activeTab === 'content' && (
                                <div className="prose prose-invert prose-cyan max-w-none animate-in fade-in duration-500">
                                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                                </div>
                            )}

                            {activeTab === 'doubts' && (
                                <div className="h-[600px] flex flex-col">
                                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                                        {chatHistory.length === 0 && (
                                            <div className="text-center text-slate-500 mt-20">
                                                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p>Have a doubt? Ask me anything about this lesson!</p>
                                            </div>
                                        )}
                                        {chatHistory.map((msg, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={i}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                                    ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-br-none'
                                                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                                                    }`}>
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {chatLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none flex space-x-2">
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Spacer for auto-scroll */}
                                        <div ref={chatEndRef}></div>
                                    </div>

                                    <form onSubmit={handleChatSubmit} className="relative">
                                        <input
                                            type="text"
                                            className="input-field pr-12"
                                            placeholder="Ask a question..."
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            disabled={chatLoading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim() || chatLoading}
                                            className="absolute right-2 top-2 bottom-2 p-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'visuals' && (
                                <div className="flex flex-col items-center justify-center h-[600px] p-8">
                                    {lesson.assets?.video_storyboard && lesson.assets.video_storyboard.length > 0 ? (
                                        <div className="w-full max-w-4xl">
                                            {/* Slideshow Container */}
                                            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-2xl group">

                                                {/* Image Background (if available) */}
                                                {lesson.assets.video_storyboard[currentSlide].image_url ? (
                                                    <div className="absolute inset-0">
                                                        <img
                                                            src={lesson.assets.video_storyboard[currentSlide].image_url}
                                                            alt={lesson.assets.video_storyboard[currentSlide].visual_prompt}
                                                            className="w-full h-full object-cover animate-[kenburns_20s_ease-in-out_infinite_alternate]"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                                    </div>
                                                ) : (
                                                    /* Fallback Gradient for Intro/Outro/Error */
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-[pulse_4s_ease-in-out_infinite]" />
                                                )}

                                                {/* Text Overlay (Visible on Hover if Image exists, always if no image) */}
                                                <div className={`absolute inset-0 flex items-center justify-center p-12 transition-opacity duration-300 ${lesson.assets.video_storyboard[currentSlide].image_url ? 'opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm' : ''}`}>
                                                    <div className="text-center">
                                                        <div className="text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase opacity-70">
                                                            Scene {currentSlide + 1} / {lesson.assets.video_storyboard.length}
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                                            {lesson.assets.video_storyboard[currentSlide].visual_prompt}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Navigation Controls */}
                                                <button
                                                    onClick={() => {
                                                        setCurrentSlide(prev => Math.max(0, prev - 1));
                                                        window.speechSynthesis.cancel();
                                                    }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                                    disabled={currentSlide === 0}
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setCurrentSlide(prev => Math.min(lesson.assets.video_storyboard.length - 1, prev + 1));
                                                        window.speechSynthesis.cancel();
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                                    disabled={currentSlide === lesson.assets.video_storyboard.length - 1}
                                                >
                                                    <Play className="w-5 h-5 rotate-0" /> {/* Reusing Play icon as arrow for now or import ArrowRight */}
                                                </button>

                                                {/* Bottom Narration Bar */}
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-20">
                                                    <div className="flex items-start space-x-4">
                                                        <button
                                                            onClick={() => {
                                                                window.speechSynthesis.cancel();
                                                                const text = lesson.assets.video_storyboard[currentSlide].narration;
                                                                const utter = new SpeechSynthesisUtterance(text);
                                                                window.speechSynthesis.speak(utter);
                                                            }}
                                                            className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                                                        >
                                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                                        </button>
                                                        <p className="text-lg text-slate-200 font-medium leading-relaxed">
                                                            {lesson.assets.video_storyboard[currentSlide].narration}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Thumbnails / Indicators */}
                                            <div className="flex justify-center space-x-2 mt-6">
                                                {lesson.assets.video_storyboard.map((_: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentSlide(idx)}
                                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-500 py-20">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p className="text-xl">No Video Storyboard available.</p>
                                            <p className="text-sm mt-2 opacity-60">Generate a new lesson to see the AI Storyboard!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'audio' && (
                                <div className="flex flex-col items-center justify-center h-[600px] text-center p-8">
                                    {lesson.assets?.audio_script && lesson.assets.audio_script !== "Narrative..." ? (
                                        <div className="max-w-xl w-full">
                                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.4)] relative">
                                                {/* Pulsing rings */}
                                                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                                <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                                <Play className="w-12 h-12 text-white fill-white ml-2" />
                                            </div>

                                            <h2 className="text-2xl font-bold text-white mb-2">Lesson Podcast</h2>
                                            <p className="text-slate-400 mb-10">Listen to an AI-generated summary of this topic.</p>

                                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                                <div className="flex justify-center space-x-6 mb-6">
                                                    <button
                                                        onClick={() => {
                                                            window.speechSynthesis.cancel();
                                                            const utterance = new SpeechSynthesisUtterance(lesson.assets.audio_script);
                                                            utterance.rate = 1.0;
                                                            utterance.pitch = 1.0;
                                                            window.speechSynthesis.speak(utterance);
                                                        }}
                                                        className="btn-energy !py-3 !px-8 flex items-center space-x-2"
                                                    >
                                                        <Play className="w-5 h-5 fill-current" />
                                                        <span>Play</span>
                                                    </button>

                                                    <button
                                                        onClick={() => window.speechSynthesis.cancel()}
                                                        className="px-8 py-3 rounded-full border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center space-x-2"
                                                    >
                                                        <div className="w-4 h-4 bg-current rounded-sm"></div>
                                                        <span>Stop</span>
                                                    </button>
                                                </div>

                                                <div className="text-left max-h-48 overflow-y-auto custom-scrollbar p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-300 text-sm leading-relaxed font-mono">
                                                    {lesson.assets.audio_script}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-500 py-20">
                                            <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p className="text-xl">Audio script not generated for this lesson.</p>
                                            <p className="text-sm mt-2 opacity-60">Try generating a new lesson to see this feature in action!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
