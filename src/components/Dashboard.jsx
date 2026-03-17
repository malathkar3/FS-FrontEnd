import React, { useContext, useState, useEffect } from 'react';
import { TimetableContext } from '../context/TimetableContext';
import { User, Loader2, Search, ArrowLeft, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import ScheduleTable from './ScheduleTable';
import FreeSlots from './FreeSlots';

const Dashboard = () => {
  const { facultyList, getFacultyData, loadFacultyList, loading, uploadFile } = useContext(TimetableContext);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyData, setFacultyData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load? if facultyList is empty? Actually, context handles if it's already loaded via isUploaded.
  // But just in case, let's allow fetching or it already comes from the initial file upload.
  useEffect(() => {
    if (facultyList.length === 0) {
      loadFacultyList();
    }
  }, []);

  const handleSelectFaculty = async (facultyName) => {
    setSelectedFaculty(facultyName);
    setFacultyData(null); // clear old data
    const data = await getFacultyData(facultyName);
    setFacultyData(data);
  };

  const filteredFaculty = facultyList.filter(f => 
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!selectedFaculty ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          <div className="px-6 py-8 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6 text-indigo-500" />
                Select Faculty
              </h2>
              <p className="text-gray-500 mt-1">Choose a faculty member to view their schedule</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search faculty..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6">
            {loading && facultyList.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
            ) : filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFaculty.map((faculty, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectFaculty(faculty)}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md hover:bg-indigo-50/30 transition-all duration-200 group text-left"
                  >
                    <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-600 transition-colors">
                      <span className="text-indigo-700 font-semibold group-hover:text-white">
                        {faculty.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700">
                        {faculty}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No faculty found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in mt-4">
          <button
            onClick={() => setSelectedFaculty(null)}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-4 py-2 rounded-lg border border-indigo-100 shadow-sm hover:shadow"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Faculty List
          </button>

          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-200" />
                {selectedFaculty}
              </h2>
              <p className="text-indigo-200 font-medium mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Current Week Schedule & Availability
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-3xl font-bold">{selectedFaculty.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {loading && !facultyData ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          ) : facultyData ? (
            <div className="space-y-8">
              <ScheduleTable schedule={facultyData.schedule} />
              <FreeSlots slots={facultyData.freeSlots} />
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-red-200">
              <p className="text-red-500 font-medium">Failed to load data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
