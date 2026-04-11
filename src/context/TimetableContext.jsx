import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api/timetable.api';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const uploadFile = React.useCallback(async (file) => {
    if (!file.name.endsWith('.docx')) {
      setError("Invalid file format. Please upload a .docx file.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await api.uploadTimetable(file);
      console.log("API Response:", res); // Debug log

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

  const clearData = React.useCallback(() => {
    setTimetableData({});
    setIsUploaded(false);
    setError(null);
  }, []);

  const value = React.useMemo(() => ({
    timetableData,
    loading,
    error,
    isUploaded,
    uploadFile,
    clearData,
    setError
  }), [timetableData, loading, error, isUploaded, uploadFile, clearData]);

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};
