import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFacultyList, fetchFacultyTimetable } from '../api/timetable.api';
import FacultyPieChart from '../components/FacultyPieChart';
import { Loader2, AlertCircle, Users, BarChart3, TrendingUp, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const { userData, currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch faculty data
        const response = await fetchFacultyList();
        
        let faculties = [];
        if (Array.isArray(response)) {
          faculties = response;
        } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
          faculties = response.data;
        } else if (response && typeof response === 'object' && Array.isArray(response.faculties)) {
          faculties = response.faculties;
        }

        setFacultyList(faculties);

        // Step 2: Fetch timetable for each faculty to calculate workload
        const workloads = faculties.length > 0 
          ? await Promise.all(
              faculties.map(async (item) => {
                const facultyIdentifier = typeof item === 'string' ? item : (item.name || item.id);
                if (!facultyIdentifier) return null;

                try {
                  const schedule = await fetchFacultyTimetable(facultyIdentifier);
                  return {
                    name: facultyIdentifier,
                    value: Array.isArray(schedule) ? schedule.length : 0,
                  };
                } catch (err) {
                  return { name: facultyIdentifier, value: 0 };
                }
              })
            )
          : [];

        setWorkloadData(workloads.filter(w => w && w.value > 0));
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please ensure the backend is running at http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Academic Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Administrator Insight</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Workload Distribution
          </h1>
          <p className="text-slate-400 font-medium mt-2">Visualizing teaching hour distribution across all faculty members.</p>
        </div>
        <div className="px-6 py-3 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex items-center gap-3">
          <Users className="text-indigo-600" size={18} />
          <span className="text-sm font-black text-indigo-900">
            {facultyList.length} Active Faculty
          </span>
        </div>
      </header>

      {error ? (
        <div className="p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <AlertCircle className="text-rose-500 w-8 h-8" />
            </div>
            <div className="max-w-md">
                <h3 className="text-xl font-bold text-rose-900 mb-2">Connection Interrupted</h3>
                <p className="text-rose-700 text-sm leading-relaxed">{error}</p>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-100 font-black text-xs uppercase tracking-widest"
            >
                Retry Connection
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Periodic Hours</p>
                    <p className="text-2xl font-black text-slate-900">{workloadData.reduce((acc, curr) => acc + curr.value, 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-4">
                        <BarChart3 size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Weekly Load</p>
                    <p className="text-2xl font-black text-slate-900">
                        {workloadData.length > 0 ? (workloadData.reduce((acc, curr) => acc + curr.value, 0) / workloadData.length).toFixed(1) : 0}h
                    </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all">
                    <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white mb-4">
                        <Calendar size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departments synced</p>
                    <p className="text-2xl font-black text-slate-900">SEC</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4">
                        <Users size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Recency</p>
                    <p className="text-2xl font-black text-slate-900">LIVE</p>
                </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
                        Workload Analytics
                    </h2>
                </div>
                <div className="h-[450px]">
                    <FacultyPieChart data={workloadData} />
                </div>
            </div>

            {/* Rankings */}
            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight capitalize">Faculty Leaderboard</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {workloadData
                        .sort((a, b) => b.value - a.value)
                        .map((faculty, idx) => (
                        <div key={faculty.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black shadow-sm transition-all group-hover:scale-110 ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-white text-slate-400'}`}>
                                    0{idx + 1}
                                </span>
                                <span className="text-slate-700 font-bold text-sm">{faculty.name}</span>
                            </div>
                            <span className="font-black text-indigo-600 bg-white px-3 py-1 rounded-lg text-xs shadow-sm">{faculty.value}h</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
