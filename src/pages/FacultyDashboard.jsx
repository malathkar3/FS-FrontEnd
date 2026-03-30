import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TimetableContext } from '../context/TimetableContext';
import FacultyDetails from '../components/FacultyDetails';
import { LogOut, User as UserIcon, AlertCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const { userData, logout } = useAuth();
  const { timetableData, isUploaded } = useContext(TimetableContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUploaded) {
      // If no timetable is uploaded, the faculty can't see their schedule
      // In a real app, we'd probably fetch this from the backend
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

  // Try to find the faculty by their name (displayName)
  const facultyName = userData?.displayName;
  const facultyExists = facultyName && timetableData && timetableData[facultyName];

  if (!isUploaded) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col pt-10">
         <div className="max-w-4xl mx-auto w-full px-6">
           <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100">
             <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
             <h2 className="text-3xl font-black text-slate-900 mb-4">No Timetable Uploaded</h2>
             <p className="text-slate-500 text-lg mb-8 leading-relaxed">
               Welcome, <span className="font-bold text-slate-800">{userData?.displayName}</span>! 
               An administrator needs to upload the master timetable before you can view your personalized schedule.
             </p>
             <button
               onClick={handleLogout}
               className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 mx-auto"
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
      <div className="min-h-screen bg-slate-50 flex flex-col pt-10">
        <div className="max-w-4xl mx-auto w-full px-6">
           <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="text-rose-500 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Profile Not Linked</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                We found the timetable, but your name "<span className="font-bold text-slate-800">{facultyName}</span>" doesn't exactly match any faculty in the system. 
                Please contact the admin to verify your registration name.
              </p>
              <div className="flex gap-4 justify-center">
                 <button
                   onClick={() => navigate('/faculty')}
                   className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg"
                 >
                   View All Faculty
                 </button>
                 <button
                   onClick={handleLogout}
                   className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                 >
                   Sign Out
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // If everything is fine, reuse FacultyDetails but maybe with a logout button
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-end">
         <button
           onClick={handleLogout}
           className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg transition-all"
         >
           <LogOut size={18} />
           <span>Sign Out</span>
         </button>
      </div>
      {/* Component will handle its own padding/layout */}
      <FacultyDetails overrideName={facultyName} />
    </div>
  );
};

export default FacultyDashboard;
