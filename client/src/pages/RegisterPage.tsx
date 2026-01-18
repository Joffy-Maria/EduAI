import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import api from '../api';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { username, email, password });
            alert('Account created! Please login.');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            alert('Registration failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-cyan-500/20 mb-4 text-cyan-400">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Join Neurobots</h2>
                    <p className="text-slate-400 mt-2">Start generating multimodal lessons today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                required
                                className="input-field pl-10"
                                placeholder="NeuroLearner"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                required
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                required
                                className="input-field pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}
