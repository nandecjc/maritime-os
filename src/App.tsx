import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Ports from './pages/Ports';
import Cargo from './pages/Cargo';
import Fuel from './pages/Fuel';
import Documents from './pages/Documents';
import FleetManagement from './pages/FleetManagement';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { CommandPalette } from './components/CommandPalette';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'user' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <CommandPalette />
          <Toaster position="top-right" theme="dark" closeButton richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute>
                <Layout><Tracking /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/ports" element={
              <ProtectedRoute>
                <Layout><Ports /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/cargo" element={
              <ProtectedRoute>
                <Layout><Cargo /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/fuel" element={
              <ProtectedRoute>
                <Layout><Fuel /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <Layout><Documents /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/fleet" element={
              <ProtectedRoute>
                <Layout><FleetManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout><Notifications /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <Layout><Admin /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
