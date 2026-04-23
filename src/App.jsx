import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import FacultyList from './components/FacultyList';
import FacultyDetails from './components/FacultyDetails';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import LoginPage from './pages/LoginPage';
import { TimetableProvider } from './context/TimetableContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFEFE] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Header />
      <main className="flex-1 w-full mx-auto pb-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="mt-auto py-6 bg-white border-t border-slate-50 text-center text-sm">
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
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Faculty Only Routes */}
            <Route path="/faculty/dashboard" element={
              <ProtectedRoute role="faculty">
                <MainLayout>
                  <FacultyDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Compatibility route for /admin/dashboard */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />

            <Route path="/faculty" element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <FacultyList />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/faculty/:name" element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <FacultyDetails />
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
