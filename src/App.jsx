import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import FacultyList from './components/FacultyList';
import FacultyDetails from './components/FacultyDetails';
import Dashboard from './pages/Dashboard';
import AdminAuth from './pages/AdminAuth';
import FacultyAuth from './pages/FacultyAuth';
import FacultyDashboard from './pages/FacultyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { TimetableProvider } from './context/TimetableContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFEFE] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Header />
      <main className="flex-1 w-full mx-auto pb-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="mt-auto py-10 bg-white border-t border-slate-50 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="h-0.5 w-12 bg-indigo-100 rounded-full"></div>
          <p className="font-bold text-slate-400 tracking-widest uppercase text-[10px]">
            Timetablely Dashboard &copy; 2026 • Elegant Schedule Management
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TimetableProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/faculty/auth" element={<FacultyAuth />} />
            
            <Route path="/faculty-dashboard" element={
              <ProtectedRoute role="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected Dashboard Routes */}
            <Route path="/faculty" element={
              <MainLayout>
                <FacultyList />
              </MainLayout>
            } />
            
            <Route path="/faculty/:name" element={
              <MainLayout>
                <FacultyDetails />
              </MainLayout>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TimetableProvider>
    </AuthProvider>
  );
}

export default App;


