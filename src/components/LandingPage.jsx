import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Zap,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadSection from './UploadSection';

const PortalsSection = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, isFaculty } = useAuth();

  if (currentUser) {
    return (
      <div className="max-w-2xl mx-auto w-full px-6 flex flex-col items-center">
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center w-full">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200 transition-transform group-hover:rotate-6 duration-500">
            <LayoutDashboard size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4">Welcome back!</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            You are logged in as <span className="font-bold text-indigo-600">{isAdmin ? 'Administrator' : 'Faculty Member'}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/faculty/dashboard')}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-2xl transition-all active:scale-95"
            >
              <span>{isAdmin ? 'Admin Dashboard' : 'Faculty Dashboard'}</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
            >
              <span>Analysis Tool</span>
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full px-6">
      <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200 transition-transform group-hover:rotate-6 duration-500">
          <ShieldAlert size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Admin Portal</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
          Manage master schedules, faculty lists, and global workload insights.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95"
        >
          <span>Sign In as Admin</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-100 transition-transform group-hover:rotate-6 duration-500">
          <GraduationCap size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Faculty Portal</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
          View your personalized schedule, free slots, and workload analysis.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95"
        >
          <span>Faculty Member Login</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { isAdmin, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFEFE] pt-10 pb-2 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50/50 to-emerald-50/30 rounded-full blur-3xl -z-10 animate-pulse duration-[10000ms]"></div>

        <div className="text-center mb-24 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-12 duration-1000">

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
            Manage Schedules <br />
            With <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Intelligence.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Interactive, visual, and precise. One platform for college administration and faculty workload management.
          </p>
        </div>

        {isAdmin && currentUser ? (
          <div id="upload-zone" className="animate-in fade-in zoom-in-95 duration-700 pb-10">
            <UploadSection />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <PortalsSection />
          </div>
        )}

        <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto opacity-70">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0"><Zap size={20} /></div>
            <div>
              <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Instant Extraction</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">Get full faculty data from .docx in milliseconds.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><BarChart3 size={20} /></div>
            <div>
              <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Visual Dashboards</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">Beautifully mapped workload & free slot analysis.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0"><CheckCircle2 size={20} /></div>
            <div>
              <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Error Free</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">Automatic validation of course hours & availability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
