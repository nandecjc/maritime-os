import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Search,
  ChevronRight,
  Activity,
  Bell,
  CheckCircle2,
  Info,
  MoreHorizontal,
  BarChart3,
  PieChart as PieIcon,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useNotifications } from '../context/NotificationContext';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-8 rounded-[2.5rem] space-y-6 group hover:border-white/20 transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center text-white/30 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all border border-white/10">
        <Icon className="w-7 h-7" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border",
          trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-4xl font-bold mt-1 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'The system is processing your request in the background.',
      });
    });
  };

  return (
    <div className="space-y-10 pb-12 relative">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-blue">Enterprise v2.4</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Global Fleet Command</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Fleet Operations</h1>
        </motion.div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-4 glass hover:bg-white/10 rounded-2xl relative group transition-all"
            >
              <Bell className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#050505] animate-pulse" />
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 glass-dark rounded-[2rem] border border-white/10 shadow-2xl z-[1000] overflow-hidden"
                >
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold">Notifications</h3>
                    <button 
                      onClick={() => {
                        markAllAsRead();
                        handleAction('Mark all as read');
                      }}
                      className="text-[10px] font-bold text-brand-400 uppercase tracking-widest"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          markAsRead(notif.id);
                          handleAction(`View Notification: ${notif.message}`);
                        }}
                        className={cn(
                          "p-6 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 group cursor-pointer",
                          !notif.read && "bg-brand-500/[0.02]"
                        )}
                      >
                        <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            notif.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                            notif.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                            'bg-blue-500/10 text-blue-500'
                          )}>
                            {notif.type === 'congestion' ? <AlertTriangle className="w-5 h-5" /> : 
                             notif.type === 'weather' ? <Info className="w-5 h-5" /> : 
                             <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold truncate capitalize">{notif.type} Alert</h4>
                              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-10 text-center text-white/20 text-xs">No active notifications</div>
                    )}
                  </div>
                  <div className="p-4 bg-white/[0.02] text-center">
                    <button 
                      onClick={() => handleAction('View all activity')}
                      className="text-xs font-bold text-white/40 hover:text-white transition-colors"
                    >
                      View all activity
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => handleAction('Command Palette')}
            className="btn-secondary flex items-center gap-3 px-6"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Command Palette</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-mono">⌘K</span>
          </button>
          <button 
            onClick={() => handleAction('New Voyage')}
            className="btn-primary px-8"
          >
            New Voyage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Vessels" value="124" icon={Ship} trend="up" trendValue="+12%" delay={0.1} />
        <StatCard title="Port Congestion" value="Critical" icon={Anchor} trend="down" trendValue="-5%" delay={0.2} />
        <StatCard title="Cargo in Transit" value="48.2k t" icon={Package} trend="up" trendValue="+8%" delay={0.3} />
        <StatCard title="Fuel Efficiency" value="94.2%" icon={TrendingUp} trend="up" trendValue="+2.4%" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-8 glass p-10 rounded-[3rem] space-y-10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Operational Performance</h3>
              <p className="text-white/20 text-xs mt-1">Fleet-wide efficiency and throughput metrics.</p>
            </div>
            <div className="flex gap-2 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
              {['Day', 'Week', 'Month'].map(period => (
                <button key={period} className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  period === 'Week' ? "bg-white text-black shadow-xl" : "text-white/20 hover:text-white"
                )}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '20px', backdropFilter: 'blur(20px)', padding: '16px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Operational Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-4 glass p-10 rounded-[3rem] bg-gradient-to-br from-brand-500/10 via-transparent to-transparent border-brand-500/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-32 h-32 text-brand-400" />
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 border border-brand-500/20 shadow-2xl shadow-brand-500/20">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Operational Insights</h3>
              <p className="text-white/20 text-xs mt-1">System Anomaly Detection</p>
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">Predictive Engine</span>
                <span className="text-[10px] text-white/20 font-bold">LIVE</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                <span className="text-white font-bold">Oceanic Voyager</span> is likely to be delayed by <span className="text-rose-400 font-bold">6.5 hours</span> due to increasing congestion at Port of Durban.
              </p>
              <button 
                onClick={() => handleAction('Optimize Route')}
                className="btn-secondary w-full py-3 text-xs font-bold text-brand-400 flex items-center justify-center gap-2 hover:bg-brand-500/10 transition-all"
              >
                Optimize Route <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Efficiency Protocol</span>
                <span className="text-[10px] text-white/20 font-bold">2H AGO</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Reducing speed by <span className="text-emerald-400 font-bold">1.2 knots</span> on Route A-12 could save <span className="text-white font-bold">$14,200</span> in fuel costs.
              </p>
            </div>

            <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Anomaly Detected</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">Unusual course deviation detected for <span className="text-white font-bold">Pacific Star</span>. Weather risk level: <span className="text-amber-400 font-bold">Moderate</span>.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-10 rounded-[3rem] space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight">Smart Alerts</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{notifications.filter(n => !n.read).length} Active</span>
            </div>
          </div>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((alert, i) => (
              <div 
                key={i} 
                onClick={() => handleAction(`View Alert: ${alert.message}`)}
                className="flex items-start gap-5 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                  alert.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                  alert.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-blue-500/10 text-blue-500'
                )}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold group-hover:text-white transition-colors truncate">{alert.message}</p>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                      alert.severity === 'high' ? 'border-rose-500/20 text-rose-500' :
                      alert.severity === 'medium' ? 'border-amber-500/20 text-amber-500' :
                      'border-blue-500/20 text-blue-500'
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-10 text-center text-white/20 text-xs glass rounded-[2rem]">No active alerts</div>
            )}
          </div>
        </motion.div>

        {/* Global Health */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-10"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight">Supply Chain Health</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/5 rounded-xl text-white/20 transition-all"><Filter className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/5 rounded-xl text-white/20 transition-all"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-10">
              {[
                { label: 'Route Efficiency', value: 92, color: 'bg-emerald-500', icon: TrendingUp },
                { label: 'Port Throughput', value: 78, color: 'bg-brand-500', icon: Anchor },
                { label: 'Fleet Sustainability', value: 64, color: 'bg-amber-500', icon: Leaf },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/5", item.color.replace('bg-', 'text-'))}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, delay: 1 + i * 0.1 }}
                      className={cn("h-full rounded-full shadow-2xl", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 glass bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex flex-col justify-between group hover:border-brand-500/20 transition-all">
                <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-400 mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">Global Rank</p>
                  <p className="text-4xl font-bold tracking-tighter">#14</p>
                </div>
              </div>
              <div className="p-8 glass bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex flex-col justify-between group hover:border-amber-500/20 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">Optimization</p>
                  <p className="text-4xl font-bold tracking-tighter">+18%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const Leaf = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C10.2 14.4 11.5 13 12 11.5" />
  </svg>
);
