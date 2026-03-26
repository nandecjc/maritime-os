import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { authFetch } from '../lib/api';

export interface Notification {
  id: string;
  type: 'congestion' | 'delay' | 'fuel' | 'weather';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user && token) {
      // Fetch initial notifications
      authFetch('/api/notifications')
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(err => console.error('Failed to fetch notifications:', err));

      // Connect to socket
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on('new_notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Browser notification if supported
        if ("Notification" in window && window.Notification.permission === "granted") {
          new Notification("Maritime OS Alert", {
            body: notification.message,
            icon: "/favicon.ico"
          });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await authFetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n.id)));
  };

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && window.Notification.permission === "default") {
      window.Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
