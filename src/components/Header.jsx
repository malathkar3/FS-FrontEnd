import { Calendar, Info, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { userData, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="flex-shrink-0 flex items-center bg-indigo-50 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4 flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Timetable Dashboard
                </h1>
                <span className="text-xs text-indigo-600 font-medium tracking-wide uppercase">
                  Faculty Schedule Manager
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                Upload
              </Link>
              <Link to="/faculty" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                Faculties
              </Link>
              <Link to="/dashboard" className="text-sm font-semibold text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && userData ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-gray-900">
                    {userData.displayName}
                  </span>
                  <span className="text-[10px] text-indigo-500 uppercase font-black tracking-tight">
                    {userData.role}
                  </span>
                </div>
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-200">
                  <User size={18} />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="sr-only">Help</span>
                <Info className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
