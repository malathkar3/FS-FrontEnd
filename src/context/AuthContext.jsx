import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import apiClient from '../api/timetable.api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // 1. Get the latest ID token from Firebase
          const token = await user.getIdToken();
          
          // 2. Fetch the verified role and profile from the backend
          const response = await apiClient.get('/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data && response.data.success) {
            setUserData(response.data);
          } else {
            console.error("Failed to fetch user role from backend", response.data);
            setUserData(null);
          }
        } catch (error) {
          console.error("Error verifying user role with backend:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData, // { success, uid, email, displayName, role, ... }
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout,
    isAdmin: userData?.role === 'admin',
    isFaculty: userData?.role === 'faculty'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
