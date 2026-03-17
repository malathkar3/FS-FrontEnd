import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { UploadSection } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { TimetableContext } from './context/TimetableContext';
import './App.css';

function MainApp() {
  const { isUploaded } = useContext(TimetableContext);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {!isUploaded ? (
          <div className="flex justify-center mt-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50"></div>
              <UploadSection />
            </div>
          </div>
        ) : (
          <Dashboard />
        )}
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

