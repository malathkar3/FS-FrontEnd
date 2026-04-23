import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { checkUserRole } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null); // "admin" or "faculty"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      setError(null);
      
      if (user) {
        try {
          // 1. Get Firebase ID token
          await user.getIdToken();
          
          // 2. Fetch role and profile from backend
          const data = await checkUserRole();
          
          if (data && data.role) {
            setUserRole(data.role);
            setUserProfile(data); // Store the full profile (includes displayName)
          } else {
            console.error("No role returned from backend");
            setUserRole(null);
            setUserProfile(null);
            setError("Access Denied: Role not found.");
          }
        } catch (err) {
          console.error("Error verifying user role:", err);
          setUserRole(null);
          setUserProfile(null);
          setError("Access Denied: Authentication failed.");
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    userRole,
    loading,
    error,
    login,
    logout,
    isAdmin: userRole === 'admin',
    isFaculty: userRole === 'faculty'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
