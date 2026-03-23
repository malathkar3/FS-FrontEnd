import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api/timetable.api';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const uploadFile = async (file) => {
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
  };

  const clearData = () => {
    setTimetableData({});
    setIsUploaded(false);
    setError(null);
  };

  return (
    <TimetableContext.Provider
      value={{
        timetableData,
        loading,
        error,
        isUploaded,
        uploadFile,
        clearData,
        setError
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
