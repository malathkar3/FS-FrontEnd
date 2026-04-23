import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userRole, loading, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If authenticated but role doesn't match, perform logout as per requirements
    if (!loading && currentUser && role && userRole !== role) {
        console.warn(`Unauthorized access attempt to ${role} route by ${userRole}`);
        logout();
    }
  }, [loading, currentUser, userRole, role, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying Access...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to landing page on logout or if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a role is required, check if user has it
  if (role && userRole !== role) {
    // While the useEffect handles logout, we return null or a redirect here to prevent rendering children
    return <Navigate to="/login" state={{ error: "Access Denied" }} replace />;
  }

  return children;
};

export default ProtectedRoute;
