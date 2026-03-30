import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';

const FacultyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, displayName, 'faculty');
      }
      navigate('/faculty-dashboard'); // New route for logged in faculty
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6 rotate-3 hover:rotate-0 transition-transform">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Faculty {isLogin ? 'Login' : 'Registration'}
          </h2>
          <p className="mt-3 text-slate-500 font-medium">
            Access your personalized teaching schedule
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl text-rose-700 text-sm font-bold flex items-center gap-3">
             <div className="h-2 w-2 bg-rose-500 rounded-full animate-ping"></div>
             {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-12 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium bg-slate-50/50"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-12 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium bg-slate-50/50"
                placeholder="Faculty Email"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-12 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium bg-slate-50/50"
                placeholder="Secure Password"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "No account? Join the faculty portal" : "Already member? Login here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyAuth;
