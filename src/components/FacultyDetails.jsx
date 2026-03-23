import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TimetableContext } from '../context/TimetableContext';
import { ArrowLeft, Sparkles, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import ScheduleTable from './ScheduleTable';

const FacultyDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { timetableData, loading, isUploaded } = useContext(TimetableContext);

  console.log(`Rendering FacultyDetails for "${name}" with data:`, timetableData?.[name]);

  useEffect(() => {
    if (!isUploaded) {
      navigate('/');
    }
  }, [isUploaded, navigate]);

  const faculty = timetableData?.[name];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
        <p className="text-xl font-bold text-gray-700 animate-pulse">Analyzing faculty data...</p>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/faculty')}
          className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-5 py-2.5 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Faculty List
        </button>
        <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-red-50 max-w-2xl mx-auto overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-red-50 rounded-full opacity-50"></div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Faculty Not Found</h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">The faculty member "<span className="text-gray-900 font-bold">{name}</span>" could not be located in the uploaded timetable.</p>
          <button
            onClick={() => navigate('/faculty')}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Return to Faculty List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <button
        onClick={() => navigate('/faculty')}
        className="inline-flex items-center text-sm font-black text-indigo-600 hover:text-indigo-800 transition-all bg-white px-5 py-3 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-xl shadow-indigo-100/30 mb-10 group active:scale-95"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
        Back to Dashboard
      </button>

      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 -mr-48 -mt-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 -ml-32 -mb-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 border border-white/10 text-indigo-100 text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-200" />
            Faculty Insights
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-4 text-white leading-tight">
            {name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 rounded-2xl border border-white/5 font-bold text-sm">
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>Full Week Schedule</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 rounded-2xl border border-white/5 font-bold text-sm">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span>{faculty.freeSlots?.length || 0} Free Slots Available</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block">
          <div className="h-40 w-40 bg-white shadow-2xl rounded-full flex items-center justify-center border-[8px] border-white/20 transform hover:scale-105 transition-transform duration-500 group">
            <User className="w-20 h-20 text-indigo-600 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:gap-16 pb-20">
        <section className="bg-white rounded-[2rem] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <Calendar className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black text-slate-800">Weekly Schedule & Free Slots</h3>
          </div>
          <ScheduleTable schedule={faculty.schedule} freeSlots={faculty.freeSlots} />
        </section>
      </div>
    </div>
  );
};

export default FacultyDetails;
