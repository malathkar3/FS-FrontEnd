import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Calendar
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, currentUser, userRole, loading: authLoading } = useAuth();
  const [initDone, setInitDone] = useState(false);

  // Requirement: Ensure a "fresh" login by clearing any existing session on mount
  useEffect(() => {
    const clearSession = async () => {
      if (currentUser && !initDone) {
        await logout();
      }
      setInitDone(true);
    };
    clearSession();
  }, [currentUser, logout, initDone]);

  // Get potential error from navigation state (e.g. from ProtectedRoute)
  useEffect(() => {
    if (location.state?.error) {
        setError(location.state.error);
    }
  }, [location]);

  // Redirect handles are NOT needed for automatic skip anymore as we want manual entry
  // But we still need to redirect AFTER they submit the form successfully
  useEffect(() => {
    if (currentUser && userRole && !authLoading && initDone) {
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'faculty') {
        navigate('/faculty/dashboard');
      }
    }
  }, [currentUser, userRole, authLoading, navigate, initDone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLocalLoading(true);
      setError(null);
      await login(email, password);
      // Success redirection is handled by the useEffect above once userRole is fetched
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-100">
            <Calendar size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Timetable Dashboard</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Login</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
            <p className="text-xs text-rose-800 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-bold text-slate-900 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-bold text-slate-900 transition-all outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading || authLoading}
            className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              localLoading || authLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
            }`}
          >
            {localLoading || authLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
