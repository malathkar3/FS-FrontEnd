import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Known UIDs mapped to their roles
const KNOWN_USERS = {
  'hXShTn9lNMgqLCqcs7gBfg2CKOH2': 'faculty',
  'ubNIFAwNmfWrdCvQbonxpxle14K2': 'admin',
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determines which Firestore collection a role belongs to
  const getCollectionForRole = (role) => {
    if (role === 'faculty') return 'faculty';
    if (role === 'admin') return 'admin';
    return 'users'; // fallback
  };

  // Tries to find user doc in either 'faculty' or 'admin' collection
  const fetchUserData = async (user) => {
    // 1. Check 'faculty' collection
    const facultyRef = doc(db, 'faculty', user.uid);
    const facultySnap = await getDoc(facultyRef);
    if (facultySnap.exists()) {
      return { ...facultySnap.data(), _collection: 'faculty' };
    }

    // 2. Check 'admin' collection
    const adminRef = doc(db, 'admin', user.uid);
    const adminSnap = await getDoc(adminRef);
    if (adminSnap.exists()) {
      return { ...adminSnap.data(), _collection: 'admin' };
    }

    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        let data = await fetchUserData(user);

        if (!data) {
          // New user — determine role from known UIDs or default to 'admin'
          const role = KNOWN_USERS[user.uid] ?? 'admin';
          const collection = getCollectionForRole(role);

          const newUserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            role,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, collection, user.uid), newUserProfile);
          data = { ...newUserProfile, _collection: collection };
        }

        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    const collection = getCollectionForRole(role);

    const newUserData = {
      uid: user.uid,
      email: user.email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, collection, user.uid), newUserData);
    setUserData({ ...newUserData, _collection: collection });
    return user;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUserData(null);
    setCurrentUser(null);
    return signOut(auth);
  };

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    isAdmin: userData?.role === 'admin',
    isFaculty: userData?.role === 'faculty',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};