import React, { useEffect, useState } from 'react';
import { Anchor, Clock, AlertTriangle, ArrowRight, MapPin, TrendingUp, Activity, Ship } from 'lucide-react';
import { Port } from '../types';
import { authFetch } from '../lib/api';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const trendData = [
  { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }
];

const PortSkeleton = () => (
  <div className="glass p-8 rounded-[2.5rem] space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/5 rounded-2xl" />
        <div className="space-y-2">
          <div className="w-32 h-6 bg-white/5 rounded-lg" />
          <div className="w-24 h-4 bg-white/5 rounded-lg" />
        </div>
      </div>
      <div className="w-24 h-8 bg-white/5 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5" />
      ))}
    </div>
    <div className="h-32 bg-white/5 rounded-2xl border border-white/5" />
  </div>
);

export default function Ports() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const data = await authFetch('/api/ports').then(res => res.json());
        setPorts(data);
      } catch (err) {
        console.error('Failed to fetch ports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPorts();
  }, []);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'This feature is currently being processed by the port authority system.',
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
            <span className="badge badge-emerald">Real-time Feed</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Global Network</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Port Operations</h1>
        </motion.div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('Export Analytics')}
            className="btn-secondary"
          >
            Export Analytics
          </button>
          <button 
            onClick={() => handleAction('Manage Slots')}
            className="btn-primary"
          >
            Manage Slots
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          [1, 2, 3, 4].map(i => <PortSkeleton key={i} />)
        ) : (
          ports.map((port, i) => (
            <motion.div 
              key={port.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] space-y-8 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all border border-white/10">
                    <Anchor className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{port.name}</h3>
                    <p className="text-[10px] text-white/20 flex items-center gap-1 uppercase font-bold tracking-widest mt-1">
                      <MapPin className="w-3 h-3" /> {port.location}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  port.congestion_level === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  port.congestion_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                )}>
                  {port.congestion_level} Congestion
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 relative z-10">
                {[
                  { icon: Clock, label: 'Queue Time', value: port.queue_time, color: 'text-brand-400' },
                  { icon: AlertTriangle, label: 'Active Delays', value: '12', color: 'text-rose-400' },
                  { icon: Activity, label: 'Berth Usage', value: '84%', color: 'text-emerald-400' },
                ].map((stat, j) => (
                  <div key={j} className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                    <stat.icon className={cn("w-4 h-4 mb-3", stat.color)} />
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Congestion Trend</h4>
                  <span className="text-[10px] font-bold text-emerald-400">+4.2% Efficiency</span>
                </div>
                <div className="h-24 w-full bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={port.congestion_level === 'High' ? '#fb7185' : '#38bdf8'} 
                        fill={port.congestion_level === 'High' ? '#fb718520' : '#38bdf820'} 
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-9 h-9 rounded-full border-4 border-[#050505] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                        <Ship className="w-4 h-4" />
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-full border-4 border-[#050505] bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">
                      +8
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Vessels in Queue</span>
                </div>
                <button 
                  onClick={() => handleAction('View Port Schedule')}
                  className="flex items-center gap-2 text-xs font-bold text-brand-400 hover:gap-3 transition-all"
                >
                  View Port Schedule <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
