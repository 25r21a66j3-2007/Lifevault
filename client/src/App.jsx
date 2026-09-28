import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import NomineesPage from './pages/NomineesPage';
import DocumentsPage from './pages/DocumentsPage';
import AIGapsPage from './pages/AIGapsPage';
import LegacyMapPage from './pages/LegacyMapPage';
import AssistantPage from './pages/AssistantPage';
import ActivationPage from './pages/ActivationPage';
import NomineePortalPage from './pages/NomineePortalPage';
import SecurityPage from './pages/SecurityPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Layout
function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Initializing LifeVault...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Protected Route by Role
function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Vault Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/nominees" element={<NomineesPage />} />
            <Route path="/legacy-map" element={<LegacyMapPage />} />
            <Route path="/ai-gaps" element={<AIGapsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/activation" element={<ActivationPage />} />
            
            {/* Nominee Portal */}
            <Route path="/nominee-portal" element={<NomineePortalPage />} />

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <AdminPage />
                </RequireRole>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
