import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const FacultyAuth = () => {
  const { loginWithGoogle, currentUser, userData, isFaculty } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userData) {
      if (isFaculty) {
        navigate('/faculty-dashboard');
      } else {
        setError("Access Denied: You are not registered as a faculty member.");
      }
    }
  }, [currentUser, userData, isFaculty, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-12 border border-slate-100 relative overflow-hidden">
        <button 
          onClick={() => navigate('/')}
          className="mb-12 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group text-sm font-bold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-100">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Portal</h1>
          <p className="text-slate-500 mt-3 text-sm font-medium">View your schedule & managed slots</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-[0.98] shadow-sm"
        >
          {loading ? (
            <Loader2 className="animate-spin text-indigo-600" size={20} />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <footer className="mt-12 text-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
           Public access restricted
        </footer>
      </div>
    </div>
  );
};

export default FacultyAuth;
