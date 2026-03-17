import { Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <span className="sr-only">Help</span>
              <Info className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
