import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { TimetableContext } from './context/TimetableContext';
import './App.css';

function MainApp() {
  const { isUploaded } = useContext(TimetableContext);

  if (!isUploaded) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
      
      <footer className="mt-auto py-8 text-center text-sm text-gray-400">
        <p>Built for simple & elegant timetable management.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainApp />} />
        {/* Redirect any other paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

