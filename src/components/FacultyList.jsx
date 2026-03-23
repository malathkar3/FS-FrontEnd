import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimetableContext } from '../context/TimetableContext';
import { User, Search, RefreshCw, Plus } from 'lucide-react';

const FacultyList = () => {
  const { timetableData, loading, clearData } = useContext(TimetableContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  console.log("Rendering FacultyList with data:", timetableData);

  const facultyNames = Object.keys(timetableData || {});

  const filteredFaculty = facultyNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReset = () => {
    clearData();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading faculty members...</p>
      </div>
    );
  }

  if (facultyNames.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto px-6">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-8">Please upload a timetable file to view faculty schedules.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5 mr-2" />
          Upload Timetable
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        <div className="px-6 py-8 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <User className="h-6 w-6" />
              </div>
              Faculty Members
            </h2>
            <p className="text-gray-500 mt-1">Explore schedules and free slots for {facultyNames.length} faculty members</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search faculty..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={handleReset}
              className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group"
              title="Reset Data"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {filteredFaculty.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/faculty/${name}`)}
                  className="group relative flex flex-col p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                  
                  <div className="relative z-10 h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300 shadow-sm">
                    <span className="text-indigo-700 font-bold text-xl group-hover:text-white">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {name}
                    </p>
                    <p className="text-gray-400 text-sm mt-1 font-medium">View Schedule</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No faculty found matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyList;
