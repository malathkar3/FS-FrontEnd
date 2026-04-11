import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Home, 
  Lock,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userData, isAdmin, isFaculty } = useAuth();

  const handleGoHome = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else if (isFaculty) {
      navigate('/faculty/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] flex flex-col justify-center items-center p-6 text-center">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-50 rounded-full blur-[120px] -z-10 opacity-60 animate-pulse"></div>

      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(244,63,94,0.1)] p-12 md:p-16 border border-rose-50 relative animate-in fade-in zoom-in-95 duration-1000">
        
        <header className="mb-12 relative">
          <div className="w-24 h-24 bg-rose-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-rose-100 rotate-6 hover:rotate-0 transition-all duration-500">
            <Lock size={44} strokeWidth={2.5} />
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-50 rounded-full text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-rose-100 shadow-sm">
             <ShieldAlert size={14} />
             <span>Access Denied</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">Unauthorized</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto text-lg italic">
            "Your digital credentials are valid, but they do not hold authority for this sector."
          </p>
        </header>

        <div className="bg-slate-50/80 rounded-3xl p-8 mb-12 border border-slate-100 text-left">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md text-emerald-500">
                 <Zap size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated Email</p>
                 <p className="text-sm font-bold text-slate-900 truncate max-w-[240px]">{userData?.email || 'N/A'}</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md text-indigo-500">
                 <LayoutDashboard size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Authority</p>
                 <p className="text-sm font-bold text-slate-900 uppercase tracking-[0.05em]">{userData?.role || 'Restricted Access'}</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:border-slate-200 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          <button
            onClick={handleGoHome}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 active:scale-95"
          >
            <Home size={18} />
            <span>Return to Dashboard</span>
          </button>
        </div>

        <footer className="mt-12 opacity-30">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
             Error 403 • Restricted Zone • Timetablely RBAC
           </p>
        </footer>
      </div>
    </div>
  );
};

export default Unauthorized;
