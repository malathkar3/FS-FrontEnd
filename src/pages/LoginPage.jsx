import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
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
  const { loginWithEmail, currentUser, userData, loading: authLoading, isAdmin, isFaculty } = useAuth();

  // Redirect if already logged in and role is verified
  useEffect(() => {
    if (currentUser && userData && !authLoading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isFaculty) {
        navigate('/faculty/dashboard');
      } else {
        // Logged in but no recognized role
        navigate('/unauthorized');
      }
    }
  }, [currentUser, userData, authLoading, isAdmin, isFaculty, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLocalLoading(true);
      setError(null);
      await loginWithEmail(email, password);
      // Navigation is handled by the useEffect above once userData is fetched
    } catch (err) {
      console.error("Login component error:", err);
      setError("Invalid email or password. Please try again.");
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_20%_20%,_rgba(79,70,229,0.05)_0%,_transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_80%_80%,_rgba(16,185,129,0.05)_0%,_transparent_50%)]"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] p-10 md:p-14 border border-slate-50 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Branding */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Calendar size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Welcome Back</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Access Portal</p>
        </div>

        {error && (
          <div className="mb-10 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <AlertCircle className="text-rose-500" size={20} />
            </div>
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-2xl text-sm font-bold text-slate-900 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-2xl text-sm font-bold text-slate-900 transition-all outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading || authLoading}
            className={`group w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-8 ${
              localLoading || authLoading
                ? 'bg-slate-100 text-slate-400 cursor-wait'
                : 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 hover:-translate-y-1'
            }`}
          >
            {localLoading || authLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <footer className="mt-14 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Auth</span>
           </div>
           <p className="text-[9px] text-slate-300 font-medium text-center">
             Access is logged and monitored for security purposes. Unauthorized attempts will be reported.
           </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
