import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, User as UserIcon, LogOut, AlertTriangle, Info, Clock, Fuel as FuelIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);

  if (!user) return <>{children}</>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'congestion': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'delay': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'fuel': return <FuelIcon className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg w-96 border border-white/5 focus-within:border-blue-500/50 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vessels, ports, or cargo..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/5 rounded-full transition-all group"
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-80 glass border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] uppercase tracking-wider font-bold text-blue-500 hover:text-blue-400"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative ${!n.read ? 'bg-blue-500/5' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className="mt-1">{getIcon(n.type)}</div>
                                <div className="flex-1">
                                  <p className={`text-sm leading-tight ${!n.read ? 'font-medium text-white' : 'text-gray-400'}`}>
                                    {n.message}
                                  </p>
                                  <p className="text-[10px] text-gray-600 mt-1">
                                    {new Date(n.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                                {!n.read && (
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-white/10 group relative">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/10 rounded-xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 shadow-2xl">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

