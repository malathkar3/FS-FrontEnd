import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TimetableContext } from '../context/TimetableContext';
import FacultyDetails from '../components/FacultyDetails';
import { LogOut, User as UserIcon, AlertCircle, ArrowRight, Calendar } from 'lucide-react';

const FacultyDashboard = () => {
  const { currentUser, logout, userData } = useAuth();
  const { timetableData, isUploaded } = useContext(TimetableContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUploaded) {
      // If no timetable is uploaded, the faculty can't see their schedule
    }
  }, [isUploaded]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Robust lookup: identifying the faculty member in the timetable
  const getLinkedFacultyName = () => {
    if (!timetableData || Object.keys(timetableData).length === 0) return null;

    // 1. Try backend displayName (preferred, e.g., "nikhil")
    const searchName = (userData?.displayName || currentUser?.displayName || "").trim();
    if (searchName) {
      // Direct match
      if (timetableData[searchName]) return searchName;
      
      // Case-insensitive match
      const keys = Object.keys(timetableData);
      const matchedKey = keys.find(k => k.toLowerCase() === searchName.toLowerCase());
      if (matchedKey) return matchedKey;
    }

    // 2. Try email match (if the keys are emails or contain them)
    const searchEmail = (userData?.email || currentUser?.email || "").trim();
    if (searchEmail) {
      const keys = Object.keys(timetableData);
      const matchedKey = keys.find(k => k.toLowerCase() === searchEmail.toLowerCase());
      if (matchedKey) return matchedKey;
    }

    return null;
  };

  const facultyName = getLinkedFacultyName();
  const facultyExists = !!facultyName;
  
  // For error display, determine what we actually tried to use
  const attemptedIdentifier = userData?.displayName || userData?.email || currentUser?.email || "Unknown Profile";

  if (!isUploaded) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col pt-10 px-6">
         <div className="max-w-4xl mx-auto w-full">
           <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
               <AlertCircle className="w-10 h-10 text-amber-500" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-4">No Timetable Uploaded</h2>
             <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-lg mx-auto font-medium">
               An administrator needs to upload the master timetable before you can view your personalized schedule.
             </p>
             <button
               onClick={handleLogout}
               className="px-10 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-3 mx-auto active:scale-95"
             >
               <LogOut size={20} />
               Sign Out
             </button>
           </div>
         </div>
       </div>
     );
  }

  // If we have data but faculty name doesn't match
  if (isUploaded && !facultyExists) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-10 px-6">
        <div className="max-w-4xl mx-auto w-full">
           <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <UserIcon className="text-rose-500 w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Profile Not Linked</h2>
              <div className="bg-rose-50/50 rounded-2xl p-6 mb-10 max-w-md mx-auto border border-rose-100">
                <p className="text-slate-600 text-base leading-relaxed font-medium">
                  We found the timetable, but your sign-in identity "<span className="font-bold text-slate-900 underline decoration-rose-300 decoration-2 underline-offset-4">{attemptedIdentifier}</span>" doesn't match any record.
                </p>
              </div>
              <p className="text-slate-400 text-sm mb-12 max-w-sm mx-auto font-bold uppercase tracking-widest leading-loose">
                Please contact technical support to sync your profile name with the master schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <button
                   onClick={handleLogout}
                   className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-100 text-slate-600 font-black rounded-2xl hover:border-rose-200 hover:text-rose-600 transition-all"
                 >
                   Sign Out
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // If everything is fine, reuse FacultyDetails but with a logout button for convenience
  return (
    <div className="min-h-screen bg-[#FDFEFE] pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
               <Calendar size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Your Dashboard</h1>
               <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-2">Personalized Schedule Engine</p>
            </div>
         </div>
         <button
           onClick={handleLogout}
           className="flex items-center gap-3 px-8 py-3 bg-white border-2 border-slate-50 text-slate-500 rounded-2xl font-black hover:text-rose-600 hover:border-rose-100 transition-all hover:shadow-xl hover:shadow-rose-100/30"
         >
           <LogOut size={18} />
           <span>Log Out</span>
         </button>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <FacultyDetails overrideName={facultyName} />
      </div>
    </div>
  );
};

export default FacultyDashboard;
