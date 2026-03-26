import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Shield, Key, Globe, LogOut, ChevronRight, Save, Trash2, AlertTriangle, Info, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { authFetch } from '../lib/api';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [role, setRole] = useState(user?.role || 'user');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setOrganization(user.organization || '');
      setAvatar(user.avatar || '');
      setRole(user.role);
    }
  }, [user]);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Settings Updated: ${action}`, {
        description: 'Your changes have been saved to the cloud.',
      });
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await authFetch('/api/auth/profile', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          organization,
          avatar,
          role
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      updateUser(data.user, data.token);

      import('sonner').then(({ toast }) => {
        toast.success('Profile Updated', {
          description: 'Your changes have been saved successfully.',
        });
      });
    } catch (err) {
      console.error('Save error:', err);
      import('sonner').then(({ toast }) => {
        toast.error('Update Failed', {
          description: 'There was an error saving your changes.',
        });
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        import('sonner').then(({ toast }) => {
          toast.error('File too large', { description: 'Max size is 2MB' });
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { label: 'Profile', icon: User, color: 'text-brand-400' },
    { label: 'Notifications', icon: Bell, color: 'text-amber-400' },
    { label: 'Security', icon: Shield, color: 'text-rose-400' },
    { label: 'API Keys', icon: Key, color: 'text-emerald-400' },
    { label: 'System', icon: Globe, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-blue">Account</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Configuration v2.4</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        </motion.div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group",
                activeTab === tab.label 
                  ? "bg-white text-black shadow-2xl shadow-white/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.label ? "text-black" : tab.color)} />
              <span className="text-sm font-bold tracking-tight">{tab.label}</span>
              {activeTab === tab.label && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
          <div className="h-px bg-white/5 my-6" />
          <button 
            onClick={logout}
            className="w-full p-4 rounded-2xl flex items-center gap-4 text-rose-500 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">Logout Session</span>
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-9 space-y-8">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight">{activeTab} Settings</h3>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Last updated: Just now</p>
            </div>

            {activeTab === 'Profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-black font-bold text-3xl border-4 border-white/10 shadow-2xl overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0].toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary text-xs px-6 py-2"
                    >
                      Change Avatar
                    </button>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Organization</label>
                    <input 
                      type="text" 
                      value={organization} 
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Role</label>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all appearance-none" 
                    >
                      <option value="user" className="bg-[#0a0a0a]">User</option>
                      <option value="admin" className="bg-[#0a0a0a]">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                {[
                  { label: 'Email Alerts', desc: 'Receive daily fleet summaries via email', active: true },
                  { label: 'Push Notifications', desc: 'Real-time alerts for critical congestion', active: true },
                  { label: 'SMS Overrides', desc: 'Emergency SMS for route deviations', active: false },
                  { label: 'Predictive Reports', desc: 'Weekly analytics-driven efficiency reports', active: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all group">
                    <div>
                      <h4 className="font-bold tracking-tight">{item.label}</h4>
                      <p className="text-xs text-white/20 mt-0.5">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleAction(`Toggle ${item.label}`)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        item.active ? "bg-brand-500" : "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        item.active ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-8">
                <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                    <h4 className="font-bold tracking-tight">Two-Factor Authentication</h4>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">2FA is currently <span className="text-rose-500 font-bold">DISABLED</span>. We strongly recommend enabling it to protect your fleet data.</p>
                  <button className="btn-secondary text-xs px-6 py-2 border-rose-500/20 text-rose-500 hover:bg-rose-500/10">Enable 2FA</button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" />
                    <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" />
                    <input type="password" placeholder="Confirm New Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <button className="flex items-center gap-2 text-rose-500 text-xs font-bold hover:underline">
                    <Trash2 className="w-4 h-4" />
                    Delete Account and All Data
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'API Keys' && (
              <div className="space-y-8">
                <div className="p-8 bg-brand-500/5 border border-brand-500/10 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <Info className="w-6 h-6 text-brand-400" />
                    <h4 className="font-bold tracking-tight">Developer Access</h4>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">Use these keys to integrate Maritime OS with your internal logistics systems. Never share your secret keys.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Production Key', key: 'pk_live_4293849283492834', status: 'Active' },
                    { label: 'Test Key', key: 'pk_test_9283492834928349', status: 'Active' },
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-between group">
                      <div>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                        <code className="text-xs font-mono text-white/60">{item.key}</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{item.status}</span>
                        <button className="p-2 glass hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all">
                          <Key className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 glass hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10">
                    Generate New API Key
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'System' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Default Language</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all appearance-none text-white">
                      <option className="bg-[#0a0a0a]">English (US)</option>
                      <option className="bg-[#0a0a0a]">Mandarin</option>
                      <option className="bg-[#0a0a0a]">Spanish</option>
                      <option className="bg-[#0a0a0a]">French</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Timezone</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-500 outline-none transition-all appearance-none text-white">
                      <option className="bg-[#0a0a0a]">UTC (Universal Time)</option>
                      <option className="bg-[#0a0a0a]">EST (New York)</option>
                      <option className="bg-[#0a0a0a]">GMT (London)</option>
                      <option className="bg-[#0a0a0a]">HKT (Hong Kong)</option>
                    </select>
                  </div>
                </div>

                <div className="p-8 glass bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h4 className="font-bold tracking-tight">Automatic Updates</h4>
                      <p className="text-xs text-white/20 mt-0.5">Keep Maritime OS updated with the latest operational models</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 bg-brand-500 rounded-full relative transition-all">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
