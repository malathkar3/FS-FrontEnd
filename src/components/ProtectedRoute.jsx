import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userData, loading, isAdmin, isFaculty } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFEFE] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-50 rounded-full animate-pulse"></div>
          <Loader2 className="absolute top-0 left-0 w-16 h-16 animate-spin text-indigo-600" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Verifying Authority...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to the landing page (Portals) on logout or if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a role is required, check if user has it
  if (role) {
    const userRole = userData?.role;
    if (userRole !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
