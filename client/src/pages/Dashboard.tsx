import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, LayoutDashboard, History, Settings, LogOut, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        try {
            const res = await api.post('/lessons/generate', { topic });
            navigate(`/lesson/${res.data._id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to generate lesson');
            setLoading(false);
        }
    };

    const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
        <div className={`flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all whitespace-nowrap group/item ${active ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Icon className="w-6 h-6 shrink-0" />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">{label}</span>
        </div>
    );

    return (
        <div className="flex h-full w-full">
            {/* Interactive Corner Sidebar */}
            <motion.div
                initial={{ width: '4.5rem' }}
                whileHover={{ width: '16rem' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-4 top-4 bottom-4 glass-panel rounded-2xl flex flex-col overflow-hidden z-50 group shadow-2xl border border-white/10"
            >
                <div className="p-4 flex items-center justify-center group-hover:justify-start transition-all">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="ml-4 font-bold text-xl tracking-tight opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Neurobots
                    </span>
                </div>

                <div className="flex-1 px-3 py-6 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={History} label="My Lessons" />
                    <SidebarItem icon={Settings} label="Settings" />
                </div>

                <div className="p-3 mt-auto border-t border-white/5">
                    <button onClick={logout} className="flex items-center space-x-3 px-3 py-3 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group/btn overflow-hidden whitespace-nowrap">
                        <LogOut className="w-6 h-6 shrink-0" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Sign Out</span>
                    </button>
                    {/* User Profile Mini */}
                    <div className="mt-4 flex items-center bg-slate-800/50 p-2 rounded-xl border border-white/5 overflow-hidden whitespace-nowrap">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shrink-0"></div>
                        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-sm font-semibold text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-6 perspective-1000">
                {/* Parallax Background Elements */}
                <motion.div
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"
                />
                <motion.div
                    animate={{ y: [30, -30, 30], x: [20, -20, 20], rotate: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"
                />

                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="text-center mb-16 relative z-10"
                >
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            Hello, {user?.username || 'Explorer'}
                        </span>
                        <span className="text-4xl align-top ml-4 animate-bounce inline-block">🚀</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide drop-shadow-lg">
                        Unleash your curiosity. What will you discover today?
                    </p>
                </motion.div>

                <motion.div
                    style={{ animation: 'float 6s ease-in-out infinite' }}
                    className="glass-panel p-12 rounded-[2.5rem] w-full max-w-3xl relative overflow-hidden group card-3d hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-t border-white/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-400 blur-[40px] opacity-40 animate-pulse-glow rounded-full"></div>
                                <Sparkles className="w-16 h-16 text-cyan-300 relative z-10 drop-shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
                            </div>
                        </div>

                        <form onSubmit={handleGenerate} className="w-full relative max-w-2xl transform transition-transform group-hover:scale-[1.02] duration-500">
                            <input
                                type="text"
                                className="input-field pl-8 pr-20 py-6 text-xl rounded-full bg-slate-900/80 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-slate-600/50 group-hover:border-cyan-500/50 transition-colors"
                                placeholder="e.g. The Physics of Black Holes..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-2.5 bottom-2.5 btn-energy aspect-square flex items-center justify-center !p-0 w-14 rounded-full shadow-lg hover:rotate-12 transition-transform"
                            >
                                {loading ? <Loader2 className="animate-spin w-7 h-7" /> : <ArrowRight className="w-7 h-7" />}
                            </button>
                        </form>

                        <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-60 transition-opacity duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                            {['Quantum', 'Space', 'History', 'Biology'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono uppercase tracking-widest text-slate-400 border border-white/5 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
