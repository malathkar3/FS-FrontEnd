import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userData, isAdmin, isFaculty } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to relevant login page based on context or landing page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'faculty' && !isFaculty) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
