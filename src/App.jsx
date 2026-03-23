import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import FacultyList from './components/FacultyList';
import FacultyDetails from './components/FacultyDetails';
import { TimetableProvider } from './context/TimetableContext';
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
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes wrapped in header content */}
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
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

