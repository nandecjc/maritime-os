import React, { useEffect, useState } from 'react';
import { Shield, Users, Activity, Lock, Key, Settings, AlertCircle, CheckCircle2, Clock, Search, MoreHorizontal, Trash2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { authFetch } from '../lib/api';

interface AdminLog {
  id: number;
  action: string;
  user: string;
  time: string;
  status: string;
}

export default function Admin() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await authFetch('/api/admin/logs').then(res => res.json());
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch admin logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Admin Action: ${action}`, {
        description: 'Global system override command has been broadcasted.',
      });
    });
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-rose">Root Access</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">System Architecture v4.2</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Fleet Command Center</h1>
        </motion.div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('System Settings')}
            className="p-3 glass hover:bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleAction('Add Administrator')}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Sessions', value: '42', icon: Users, color: 'text-brand-400' },
          { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Security Level', value: 'Defcon 5', icon: Shield, color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2rem] border border-white/5"
          >
            <stat.icon className={cn("w-6 h-6 mb-6", stat.color)} />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Audit Logs</h3>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white/20" />
                <input type="text" placeholder="Filter logs..." className="bg-transparent border-none outline-none text-xs text-white/40 w-32" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Action</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">User</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="px-8 py-10 text-center text-white/20">Retrieving logs...</td></tr>
                  ) : logs.map((log, i) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-all group">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold tracking-tight">{log.action}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs text-white/40">{log.user}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-mono text-white/20">{log.time}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                          log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        )}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8"
          >
            <h3 className="text-xl font-bold tracking-tight">Security Controls</h3>
            <div className="space-y-4">
              {[
                { label: 'Global Lock', icon: Lock, color: 'text-rose-400', desc: 'Freeze all vessel operations' },
                { label: 'API Keys', icon: Key, color: 'text-brand-400', desc: 'Manage external integrations' },
                { label: 'Permissions', icon: Shield, color: 'text-emerald-400', desc: 'Edit role hierarchies' },
              ].map((control, i) => (
                <button 
                  key={i}
                  onClick={() => handleAction(control.label)}
                  className="w-full p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl flex items-center gap-5 transition-all group text-left"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform", control.color)}>
                    <control.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{control.label}</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{control.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[2.5rem] border border-amber-500/10 bg-amber-500/5"
          >
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold tracking-tight">Maintenance Mode</h4>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-6">Scheduled maintenance for the global tracking system is set for Sunday, 02:00 UTC. All non-essential services will be offline.</p>
            <button 
              onClick={() => handleAction('Reschedule Maintenance')}
              className="w-full py-4 glass hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10"
            >
              Reschedule
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
