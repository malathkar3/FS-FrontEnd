import React, { createContext, useState, useCallback } from 'react';
import * as api from '../api/timetable.api';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for full data (from upload response or individual fetches)
  const [facultyDataMap, setFacultyDataMap] = useState({});

  const checkConnection = async () => {
    try {
      await api.checkHealth();
      return true;
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 5000.");
      return false;
    }
  };

  const loadFacultyList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.fetchFacultyList();
      // res is { success: true, data: [...] }
      if (res.success && Array.isArray(res.data)) {
         setFacultyList(res.data);
         setIsUploaded(res.data.length > 0);
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file.name.endsWith('.docx')) {
      setError("Invalid file format. Please upload a .docx file.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const isConnected = await checkConnection();
      if (!isConnected) return;

      const res = await api.uploadTimetable(file);
      
      if (res.success && res.data) {
        setIsUploaded(true);
        const newFacultyMap = res.data;
        setFacultyDataMap(newFacultyMap);
        setFacultyList(Object.keys(newFacultyMap));
        return true;
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to upload file");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFacultyData = async (name) => {
    // If we already have it from the upload payload, return it!
    if (facultyDataMap[name]?.schedule && facultyDataMap[name]?.freeSlots) {
      return facultyDataMap[name];
    }

    // Otherwise fetch it
    try {
      setLoading(true);
      setError(null);
      
      const [scheduleRes, freeSlotsRes] = await Promise.all([
        api.fetchFacultyTimetable(name),
        api.fetchFacultyFreeSlots(name)
      ]);

      if (scheduleRes.success && freeSlotsRes.success) {
        const newData = { 
          schedule: scheduleRes.data, 
          freeSlots: freeSlotsRes.data 
        };
        
        setFacultyDataMap(prev => ({
          ...prev,
          [name]: newData
        }));

        return newData;
      }
      return null;
    } catch (err) {
      setError("Failed to fetch data for " + name);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TimetableContext.Provider
      value={{
        isUploaded,
        facultyList,
        loading,
        error,
        facultyDataMap,
        uploadFile,
        loadFacultyList,
        getFacultyData,
        setError
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
