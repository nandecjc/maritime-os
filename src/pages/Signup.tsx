import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Anchor, Lock, Mail, User, Building2, Loader2, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-rose-500';
    if (passwordStrength < 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 2) return 'Weak';
    if (passwordStrength < 4) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (passwordStrength < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, organization }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-950 border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574743-019485b7828d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
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
                The Operating System for <br />
                <span className="text-brand-400">Global Fleet Command.</span>
              </h2>
              <p className="text-xl text-white/40 max-w-md leading-relaxed">
                Join thousands of maritime professionals managing global trade with precision and intelligence.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, label: 'Enterprise Security', desc: 'AES-256 Encryption' },
                { icon: Globe, label: 'Global Network', desc: 'Real-time AIS Data' },
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">Create Account</h1>
            <p className="text-white/40">Enter your professional details to get started.</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-white/5"
                    placeholder="Captain John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Organization</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-white/5"
                    placeholder="Global Shipping Corp"
                  />
                </div>
              </div>

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
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Secure Password</label>
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
                {password && (
                  <div className="px-1 pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Strength</span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", 
                        passwordStrength < 2 ? 'text-rose-500' : 
                        passwordStrength < 4 ? 'text-amber-500' : 'text-emerald-500'
                      )}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        className={cn("h-full transition-all duration-500", getStrengthColor())}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 px-1 py-2">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 transition-all cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-white hover:underline">Terms of Service</span> and <span className="text-white hover:underline">Privacy Policy</span>.
              </label>
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
                  <span>Create Account</span>
                  <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40">
            Already registered?{' '}
            <Link to="/login" className="text-white font-bold hover:text-brand-400 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

