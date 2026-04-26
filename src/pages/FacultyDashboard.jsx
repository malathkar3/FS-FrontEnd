import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TimetableContext } from '../context/TimetableContext';
import ScheduleTable from '../components/ScheduleTable';
import { LogOut, User as UserIcon, Calendar, Sparkles, AlertCircle, Loader2, Clock } from 'lucide-react';
import apiClient from '../services/api';

const FacultyDashboard = () => {
  const { logout, userProfile, currentUser } = useAuth();
  // We no longer depend on the global isUploaded flag for faculty
  const navigate = useNavigate();

  const [fullSchedule, setFullSchedule] = useState([]);
  const [displaySchedule, setDisplaySchedule] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [matchedName, setMatchedName] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const displayName = userProfile?.displayName || currentUser?.email || 'User';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const fetchMyTimetable = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const response = await apiClient.get('/my-timetable');
        if (response.data.success) {
          setMatchedName(response.data.matchingName);
          setFullSchedule(response.data.data);
          setDisplaySchedule(response.data.data);
          setFreeSlots(response.data.freeSlots || []);
          setAvailableSections(response.data.sections || []);
        } else {
          setError(response.data.message || 'Could not find your timetable.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load your timetable.';
        setError(msg);
      } finally {
        setLoadingData(false);
      }
    };

    fetchMyTimetable();
  }, []);

  useEffect(() => {
    if (!fullSchedule) return;
    
    if (selectedSection === 'all') {
      setDisplaySchedule(fullSchedule);
    } else {
      const filtered = fullSchedule.filter(slot => {
        // Robust matching: check explicit ID, constructed ID, or name parts
        const constructedId = `sem${slot.semester}_sec${slot.section}`.toLowerCase().replace(/\s+/g, '');
        const simpleId = `${slot.semester}_${slot.section}`.toLowerCase().replace(/\s+/g, '');
        const target = selectedSection.toLowerCase().replace(/\s+/g, '');
        
        return (slot.sectionId && slot.sectionId.toLowerCase() === target) ||
               constructedId === target ||
               simpleId === target ||
               constructedId.includes(target) ||
               target.includes(simpleId);
      });
      setDisplaySchedule(filtered);
    }
  }, [selectedSection, fullSchedule]);

  // ── No timetable uploaded yet ───────────────────────────────────────────────
  if (availableSections.length === 0 && !loadingData && !error && (!fullSchedule || fullSchedule.length === 0)) {
    return (
      <div className="flex flex-col pt-10 animate-in fade-in duration-700">
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Calendar size={40} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">No Timetable Loaded</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            The admin hasn't uploaded any timetable data yet. Please check back later.
          </p>
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-rose-600 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Fetching your timetable...
        </p>
      </div>
    );
  }

  // ── Identity mismatch / error ────────────────────────────────────────────────
  if (error || !displaySchedule) {
    return (
      <div className="flex flex-col items-center pt-10 animate-in fade-in duration-700">
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-slate-50 max-w-lg w-full">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <UserIcon size={40} className="text-rose-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Identity Mismatch</h2>
          <div className="bg-rose-50 rounded-2xl p-5 mb-6 text-left">
            <p className="text-sm text-rose-800 font-semibold leading-relaxed text-center">
              {error || 'Your profile name does not match any record in the uploaded timetable.'}
            </p>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
            Profile name from Firestore: "<span className="text-indigo-500">{displayName}</span>"
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-rose-700 transition-all"
            >
              <LogOut size={16} />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total workload (distinct slots)
  const totalWorkload = new Set(fullSchedule.map(s => `${s.day}-${s.time}`)).size;

  // ── Success: show timetable ──────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 -mr-48 -mt-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">My Timetable</h1>
            </div>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mt-2">Personal Precision Engine</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-3">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 border border-white/10 text-indigo-100 text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-200" />
            Faculty Insights
          </div>
          <h2 className="text-2xl font-black text-white">{matchedName}</h2>
          <div className="flex gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 font-bold text-sm text-emerald-100">
              <Clock size={14} className="text-emerald-300" />
              <span>{totalWorkload} Hours Workload</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl border border-white/5 font-bold text-sm">
              <UserIcon size={14} className="text-indigo-300" />
              <span>{freeSlots.length} Free Slots</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative z-10">
          <div className="h-24 w-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {/* Welcome greeting & Section Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-indigo-500">
          <Sparkles size={16} />
          <span className="font-black text-sm tracking-wide">Welcome, {displayName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {availableSections.length > 1 && (
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="pl-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Section:</span>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                <option value="all">All Sections Combined</option>
                {availableSections.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors font-bold text-sm border border-rose-100"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Timetable section */}
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Calendar size={20} />
            </div>
            Weekly Schedule &amp; Free Slots
          </h3>
          
          {selectedSection !== 'all' && (
            <div className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              Filtering: {availableSections.find(s => s.id === selectedSection)?.name}
            </div>
          )}
        </div>
        
        <ScheduleTable schedule={displaySchedule} freeSlots={freeSlots} />
      </div>
    </div>
  );
};

export default FacultyDashboard;
