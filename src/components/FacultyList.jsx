import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimetableContext } from '../context/TimetableContext';
import { User, Search, RefreshCw, Plus, BarChart2, Star, Clock, Sparkles } from 'lucide-react';
import FacultyPieChart from './FacultyPieChart';
import ScheduleTable from './ScheduleTable';

const FacultyList = () => {
  const { timetableData, loading, clearData } = useContext(TimetableContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const navigate = useNavigate();

  console.log("Rendering FacultyList with data:", timetableData);

  const facultyNames = Object.keys(timetableData || {});
  
  const filteredFaculty = facultyNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const workloadData = filteredFaculty.map(name => {
    const faculty = timetableData[name];
    const schedule = Array.isArray(faculty) ? faculty : (faculty?.schedule || []);
    return {
      name,
      value: schedule.length
    };
  }).filter(item => item.value > 0);

  // Auto-select first faculty if none selected
  React.useEffect(() => {
    if (workloadData.length > 0 && !selectedFaculty) {
      setSelectedFaculty(workloadData[0].name);
    }
  }, [workloadData, selectedFaculty]);

  const selectedFacultyData = selectedFaculty ? timetableData[selectedFaculty] : null;
  const selectedSchedule = Array.isArray(selectedFacultyData) ? selectedFacultyData : selectedFacultyData?.schedule;
  const selectedFreeSlots = selectedFacultyData?.freeSlots || [];

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
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600 shadow-inner">
                <User className="h-7 w-7" />
              </div>
              <span className="tracking-tight">Faculty Intelligence</span>
            </h2>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">Synthesized schedule overview for <span className="text-indigo-600 font-black">{facultyNames.length}</span> active members</p>
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
          {/* Workload Overview Chart - Fixed and Enhanced */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50/50 rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-indigo-500/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Workload Distribution</h3>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Comparative teaching hours analysis</p>
                  </div>
                </div>
                <div className="h-[500px] flex items-center justify-center">
                  <FacultyPieChart 
                    data={workloadData} 
                    onFacultySelect={setSelectedFaculty}
                    selectedFaculty={selectedFaculty}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-sm font-black uppercase tracking-widest opacity-70 mb-2">Total Load</h4>
                  <div className="text-5xl font-black mb-4">
                    {workloadData.reduce((acc, curr) => acc + curr.value, 0)}
                  </div>
                  <p className="text-indigo-100 text-sm font-bold">Total scheduled sessions analyzed across all departments</p>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h4 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Top Loaders</h4>
                  <div className="space-y-4">
                    {workloadData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 3)
                      .map((fac, i) => (
                        <div key={fac.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                              i === 0 ? 'bg-amber-100 text-amber-700' : 
                              i === 1 ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {i + 1}
                            </span>
                            <span className="font-bold text-gray-700 truncate max-w-[120px]">{fac.name}</span>
                          </div>
                          <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">{fac.value}h</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Schedule View - Replaces Profile Grid */}
          {selectedFaculty ? (
            <div className="mt-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between mb-12 gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 -mr-48 -mt-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 -ml-32 -mb-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 border border-white/10 text-indigo-100 text-[10px] font-black tracking-widest uppercase">
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-200" />
                    Selected Perspective
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white leading-tight">
                    {selectedFaculty}
                  </h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 rounded-2xl border border-white/5 font-bold text-sm backdrop-blur-sm">
                      <Star className="w-4 h-4 text-indigo-300" />
                      <span>{workloadData.find(f => f.name === selectedFaculty)?.value || 0} Lectures</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 rounded-2xl border border-white/5 font-bold text-sm backdrop-blur-sm">
                      <Clock className="w-4 h-4 text-indigo-300" />
                      <span>{selectedFreeSlots.length} Free Gaps</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 hidden lg:block">
                  <div className="h-32 w-32 bg-white/10 backdrop-blur-md shadow-2xl rounded-full flex items-center justify-center border-4 border-white/20 transform hover:scale-105 transition-transform duration-500 group">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-4 lg:p-8 border border-gray-100 shadow-2xl shadow-indigo-500/5 overflow-x-auto min-h-[400px]">
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Full Weekly Timeline</h3>
                  </div>
                  <button 
                    onClick={() => navigate(`/faculty/${selectedFaculty}`)}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest border-b-2 border-indigo-100 transition-all"
                  >
                    Deep Insights →
                  </button>
                </div>
                <ScheduleTable schedule={selectedSchedule} freeSlots={selectedFreeSlots} />
              </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200 animate-in fade-in duration-500">
              <BarChart2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 text-lg font-black tracking-tight">Select a faculty slice from the chart</p>
              <p className="text-gray-400 text-sm mt-2">Interactive insights will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyList;
