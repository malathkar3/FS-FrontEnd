import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api/timetable.api';
import { useAuth } from './AuthContext';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState({});
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { currentUser } = useAuth();

  const uploadFile = React.useCallback(async (file, semester, section) => {
    if (!file.name.endsWith('.docx')) {
      setError("Invalid file format. Please upload a .docx file.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await api.uploadTimetable(file, semester, section);
      console.log("API Response:", res);

      if (res.success && res.data) {
        setTimetableData(res.data);
        setIsUploaded(true);
        return true;
      } else {
        setError(res.message || "Failed to process timetable");
        return false;
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.response?.data?.detail || err.message || "Failed to upload file");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial section list when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setSections([]);
      return;
    }

    const fetchSectionsOnly = async () => {
      try {
        setLoading(true);
        const secRes = await api.fetchSections();
        if (secRes.success && secRes.data) {
          setSections(secRes.data);
        }
      } catch (err) {
        console.error("Initial Sections Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsOnly();
  }, [currentUser]);

  const loadSession = React.useCallback(async (sectionId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.fetchSectionData(sectionId);
      if (res.success && res.data) {
        setTimetableData(res.data);
        setIsUploaded(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Session Load Error:", err);
      setError("Failed to load stored timetable data.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = React.useCallback(() => {
    setTimetableData({});
    setIsUploaded(false);
    setError(null);
  }, []);

  const value = React.useMemo(() => ({
    timetableData,
    sections,
    loading,
    error,
    isUploaded,
    uploadFile,
    loadSession,
    clearData,
    setError
  }), [timetableData, sections, loading, error, isUploaded, uploadFile, loadSession, clearData]);

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};
