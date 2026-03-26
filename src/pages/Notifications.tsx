import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2, Filter, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '../lib/utils';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action: ${action}`, {
        description: 'Notification management command processed.',
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
            <span className="badge badge-blue">Real-time</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Alert Center</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">System Notifications</h1>
        </motion.div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              markAllAsRead();
              handleAction('Mark all as read');
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
          <button 
            onClick={() => handleAction('Clear all notifications')}
            className="p-3 glass hover:bg-rose-500/10 rounded-2xl text-white/40 hover:text-rose-500 transition-all border border-white/5"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex gap-6">
            {['All', 'Unread', 'Critical', 'System'].map((tab) => (
              <button 
                key={tab}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest pb-2 border-b-2 transition-all",
                  tab === 'All' ? "text-white border-white" : "text-white/20 border-transparent hover:text-white/40"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/20" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Filter</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-8 flex items-start gap-6 hover:bg-white/[0.02] transition-all group cursor-pointer",
                  !notif.read && "bg-brand-500/[0.03]"
                )}
                onClick={() => markAsRead(notif.id)}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10",
                  notif.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                  notif.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-blue-500/10 text-blue-500'
                )}>
                  {notif.type === 'congestion' ? <AlertTriangle className="w-6 h-6" /> : 
                   notif.type === 'weather' ? <Info className="w-6 h-6" /> : 
                   <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold tracking-tight capitalize">{notif.type} Alert</h4>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                      notif.severity === 'high' ? 'border-rose-500/20 text-rose-500' :
                      notif.severity === 'medium' ? 'border-amber-500/20 text-amber-500' :
                      'border-blue-500/20 text-blue-500'
                    )}>
                      {notif.severity} Priority
                    </span>
                    {!notif.read && (
                      <span className="flex items-center gap-1 text-[8px] font-bold text-brand-400 uppercase tracking-widest">
                        <span className="w-1 h-1 bg-brand-400 rounded-full animate-pulse" />
                        New
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto border border-white/5">
                <Bell className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="text-xl font-bold">All caught up</h3>
              <p className="text-white/20 text-sm max-w-xs mx-auto">You don't have any new notifications at the moment. We'll alert you when something happens.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
