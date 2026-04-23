import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData, logout, isAdmin, isFaculty, userRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Info size={18} />, hidden: !isAdmin },
    { name: 'Faculties', path: '/faculty', icon: <Users size={18} />, hidden: !isAdmin },
    { name: 'Admin Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={18} />, hidden: !isAdmin },
    { name: 'Faculty Dashboard', path: '/faculty/dashboard', icon: <Calendar size={18} />, hidden: !isFaculty },
  ].filter(link => !link.hidden);

  // Requirement: If on Landing Page (/), show clean header without user info unless verified
  const isOnLandingPage = location.pathname === '/';
  const shouldShowAuth = currentUser && (isAdmin || isFaculty) && !isOnLandingPage;
  // If we are an admin and on landing page, we can show auth to allow access to upload
  const showAuthOnLanding = currentUser && isAdmin && isOnLandingPage;
  const isFullyAuthenticated = currentUser && (isAdmin || isFaculty);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled ? 'py-3' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between transition-all duration-500 px-6 py-3 rounded-[2rem] border ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
            : 'bg-white border-transparent shadow-none'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-all duration-300">
              <Calendar size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 tracking-tight leading-none">Timetablely</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Dashboard</span>
            </div>
          </Link>

          {/* Desktop Navigation - Visible if authenticated, and accessible on home page for admins */}
          {(isFullyAuthenticated && (!isOnLandingPage || isAdmin)) && (
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Profile / Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isFullyAuthenticated && (!isOnLandingPage || isAdmin) ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-sm overflow-hidden border-2 border-white">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="pro" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] font-black text-slate-900 leading-none truncate max-w-[100px]">
                      {userData?.displayName || currentUser.displayName || 'User'}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter mt-0.5">
                      {userRole || 'Member'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-3 border-b border-slate-50 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.email}</p>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-[calc(100%-24px)] mx-3 flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors font-bold text-sm"
                      >
                        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                          <LogOut size={16} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-8 py-3 bg-slate-900 text-white rounded-full text-sm font-black shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Secure Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 text-slate-900 font-bold"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {isFullyAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold"
              >
                <LogOut />
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
