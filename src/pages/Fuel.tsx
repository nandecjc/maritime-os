import React from 'react';
import { Fuel, Leaf, TrendingDown, Zap, ArrowDownRight, Droplets, Wind, Activity, BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { authFetch } from '../lib/api';

const emissionData = [
  { name: 'Mon', co2: 45 },
  { name: 'Tue', co2: 52 },
  { name: 'Wed', co2: 48 },
  { name: 'Thu', co2: 61 },
  { name: 'Fri', co2: 55 },
  { name: 'Sat', co2: 42 },
  { name: 'Sun', co2: 38 },
];

const fuelTypeData = [
  { name: 'VLSFO', value: 65 },
  { name: 'MGO', value: 25 },
  { name: 'LNG', value: 10 },
];

const COLORS = ['#38bdf8', '#10b981', '#f59e0b'];

const FuelSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass p-8 rounded-[2rem] h-40 bg-white/5" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[1, 2].map(i => (
        <div key={i} className="glass p-8 rounded-[2.5rem] h-[450px] bg-white/5" />
      ))}
    </div>
  </div>
);

export default function FuelEmissions() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authFetch('/api/fuel-stats').then(res => res.json());
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch fuel stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'Sustainability optimization command sent to fleet.',
      });
    });
  };

  if (loading || !stats) return <FuelSkeleton />;

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald">ESG Compliance</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Net Zero Roadmap 2050</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Fuel & Sustainability</h1>
        </motion.div>
        <div className="flex gap-3 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5">
          <button 
            onClick={() => handleAction('Fleet Analytics')}
            className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-bold shadow-2xl shadow-white/10 transition-all"
          >
            Fleet Analytics
          </button>
          <button 
            onClick={() => handleAction('Vessel Specific')}
            className="px-6 py-2.5 hover:bg-white/5 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-all"
          >
            Vessel Specific
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total CO2 Emissions', value: stats.totalCo2, unit: 'tons', trend: '-12.4%', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
          { label: 'Fuel Consumption', value: stats.fuelConsumption, unit: 'liters', trend: '-2.1%', icon: Droplets, color: 'text-brand-400', bg: 'bg-brand-500/5', border: 'border-brand-500/10' },
          { label: 'Energy Efficiency', value: stats.efficiency, unit: '', trend: '-5.8%', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("glass p-8 rounded-[2rem] border group transition-all hover:scale-[1.02]", stat.border, stat.bg)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10", stat.color)}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg", stat.color, "bg-white/5")}>
                <TrendingDown className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold tracking-tight">
              {stat.value} <span className="text-sm text-white/20 font-normal">{stat.unit}</span>
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Weekly CO2 Trend</h3>
              <p className="text-white/20 text-xs mt-1">Emission intensity across global fleet.</p>
            </div>
            <BarChart3 className="w-5 h-5 text-white/20" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.emissionTrend}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Fuel Type Distribution</h3>
              <p className="text-white/20 text-xs mt-1">Inventory breakdown by propulsion type.</p>
            </div>
            <PieIcon className="w-5 h-5 text-white/20" />
          </div>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.fuelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.fuelDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-56 space-y-5 pr-4">
              {stats.fuelDistribution.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-4 h-4 rounded-lg shadow-lg" style={{ backgroundColor: COLORS[index] }}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold tracking-tight">{entry.name}</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{entry.value}% of fleet</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass p-10 rounded-[2.5rem] border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-32 h-32 text-emerald-400" />
        </div>
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Optimization Engine</h3>
            <p className="text-white/40 text-sm max-w-2xl mt-1">Predictive models suggest that reducing speed by <span className="text-emerald-400 font-bold">1.2 knots</span> on Route A could save <span className="text-emerald-400 font-bold">15%</span> in fuel costs while maintaining schedule integrity.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={() => handleAction('Apply Optimization')}
            className="py-5 bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2rem] font-bold transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            <span>Apply Optimization</span>
          </button>
          <button 
            onClick={() => handleAction('View Detailed Simulation')}
            className="py-5 glass hover:bg-white/10 rounded-[2rem] font-bold transition-all border border-white/10"
          >
            View Detailed Simulation
          </button>
        </div>
      </motion.div>
    </div>
  );
}
