import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Anchor, 
  Package, 
  Fuel, 
  Settings, 
  Bell,
  ShieldCheck,
  FileText,
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MapIcon, label: 'Live Tracking', path: '/tracking' },
  { icon: Anchor, label: 'Port Analytics', path: '/ports' },
  { icon: Package, label: 'Cargo Management', path: '/cargo' },
  { icon: Fuel, label: 'Fuel & Emissions', path: '/fuel' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Users, label: 'Fleet Management', path: '/fleet' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 h-screen glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-[100] transition-all duration-500">
      <div className="p-8 flex items-center gap-4 group cursor-pointer">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20 group-hover:scale-110 transition-transform duration-500">
          <Anchor className="text-black w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">Maritime OS</span>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] -mt-1">Enterprise v2.0</span>
        </div>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.25em]">Operational Core</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                isActive 
                  ? "bg-white text-black shadow-2xl shadow-white/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-black" : "text-white/20 group-hover:text-white")} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <div className="mt-12 space-y-2">
            <div className="px-4 mb-4">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.25em]">Administration</p>
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                  isActive 
                    ? "bg-white text-black shadow-2xl shadow-white/10" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )
              }
            >
              <ShieldCheck className="w-5 h-5 text-white/20 group-hover:text-white" />
              <span>Admin Panel</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 space-y-4 bg-white/[0.02]">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-black font-bold text-sm border-2 border-white/10 shadow-xl overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase()
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate">{user?.name || user?.email}</span>
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{user?.role} Access</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NavLink 
            to="/notifications"
            className={({ isActive }) => cn(
              "flex items-center justify-center gap-2 p-3 glass rounded-xl text-white/40 hover:text-white transition-all group",
              isActive && "bg-white/10 text-white border-white/20"
            )}
          >
            <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </NavLink>
          <NavLink 
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center justify-center gap-2 p-3 glass rounded-xl text-white/40 hover:text-white transition-all group",
              isActive && "bg-white/10 text-white border-white/20"
            )}
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          </NavLink>
        </div>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl text-xs font-bold transition-all duration-300 shadow-lg shadow-rose-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
