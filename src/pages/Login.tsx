import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Anchor, Lock, Mail, Loader2, LogIn, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-950 border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Anchor className="text-black w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">MARITIME OS</span>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold leading-tight tracking-tight text-white mb-6">
                Secure Access to <br />
                <span className="text-brand-400">Fleet Intelligence.</span>
              </h2>
              <p className="text-xl text-white/40 max-w-md leading-relaxed">
                Log in to monitor real-time vessel telemetry, manage cargo manifestos, and optimize global logistics.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, label: 'Secure Session', desc: 'JWT Authentication' },
                { icon: Globe, label: 'Live Telemetry', desc: 'Real-time Updates' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="glass p-6 rounded-2xl border border-white/5"
                >
                  <item.icon className="w-6 h-6 text-brand-400 mb-3" />
                  <h4 className="font-bold text-white text-sm">{item.label}</h4>
                  <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-white/20 text-xs font-mono">
            © 2026 MARITIME OS TECHNOLOGIES. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>

      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-white/40">Sign in to your professional command center.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-white/5"
                    placeholder="captain@maritime.os"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-white/5"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-brand-400 hover:text-black text-black disabled:opacity-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-6">
            <p className="text-center text-sm text-white/40">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white font-bold hover:text-brand-400 transition-colors">Create one</Link>
            </p>

            <div className="pt-8 border-t border-white/5">
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <ArrowRight className="w-3 h-3" />
                  <span>Demo Access</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => { setEmail('admin@maritime.os'); setPassword('admin123'); }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs group"
                  >
                    <span className="text-white/60 group-hover:text-white">Admin Command</span>
                    <span className="text-white/20 font-mono">admin123</span>
                  </button>
                  <button 
                    onClick={() => { setEmail('user@maritime.os'); setPassword('user123'); }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs group"
                  >
                    <span className="text-white/60 group-hover:text-white">Standard Operator</span>
                    <span className="text-white/20 font-mono">user123</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

