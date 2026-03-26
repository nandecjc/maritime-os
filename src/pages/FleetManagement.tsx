import React, { useEffect, useState } from 'react';
import { Ship, Users, Activity, Search, Filter, MoreHorizontal, ArrowRight, MapPin, TrendingUp, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { authFetch } from '../lib/api';
import { Ship as ShipType } from '../types';

const FleetSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass p-8 rounded-3xl h-32 bg-white/5" />
      ))}
    </div>
    <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 h-96 bg-white/5" />
  </div>
);

export default function FleetManagement() {
  const [ships, setShips] = useState<ShipType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const data = await authFetch('/api/ships').then(res => res.json());
        setShips(data);
      } catch (err) {
        console.error('Failed to fetch ships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShips();
  }, []);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'Vessel management command sent to global operations center.',
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
            <span className="badge badge-blue">Fleet Command</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Global Operations Center</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Fleet Management</h1>
        </motion.div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search vessel or crew..." 
              className="pl-12 pr-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-sm outline-none focus:border-brand-500 transition-all w-80 placeholder:text-white/10"
            />
          </div>
          <button 
            onClick={() => handleAction('Add Vessel')}
            className="btn-primary"
          >
            Add Vessel
          </button>
        </div>
      </div>

      {loading ? (
        <FleetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Vessels', value: ships.length.toString(), trend: '+2', icon: Ship, color: 'text-brand-400' },
              { label: 'Active Crew', value: '1,842', trend: '+15', icon: Users, color: 'text-emerald-400' },
              { label: 'Fleet Utilization', value: '94.2%', trend: '+1.5%', icon: Activity, color: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-lg">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Vessel Details</th>
                    <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Status</th>
                    <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Operational Efficiency</th>
                    <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Current Location</th>
                    <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ships.map((ship, i) => (
                    <motion.tr 
                      key={ship.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all border border-white/10">
                            <Ship className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold tracking-tight text-lg">{ship.name}</span>
                            <p className="text-[10px] text-white/20 font-mono mt-0.5">{ship.id} • {ship.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest border",
                          ship.status === 'In Transit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          ship.status === 'Delayed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        )}>
                          {ship.status}
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-white/20 uppercase tracking-widest">Efficiency</span>
                            <span className="text-emerald-400">94%</span>
                          </div>
                          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[94%] rounded-full" />
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <MapPin className="w-4 h-4 text-white/20" />
                          {ship.destination}
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <button className="p-3 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
