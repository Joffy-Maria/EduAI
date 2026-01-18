import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, { username: res.data.username });
            navigate('/');
        } catch (err: any) {
            console.error(err);
            alert('Login failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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
                        className="w-full btn-primary flex items-center justify-center shadow-lg shadow-cyan-500/30"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">Create one</Link>
                </p>
            </motion.div>
        </div>
    );
}
