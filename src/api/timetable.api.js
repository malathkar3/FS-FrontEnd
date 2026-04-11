import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to inject the Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting Firebase ID token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadTimetable = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // Endpoint updated to /upload-timetable without trailing slash
  const response = await apiClient.post('/upload-timetable', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchFacultyList = async () => {
  // Endpoint updated to /faculty-data
  const response = await apiClient.get('/faculty-data');
  return response.data;
};

export const fetchFacultyTimetable = async (name) => {
  // Endpoint updated to /faculty-data/:name/timetable
  const response = await apiClient.get(`/faculty-data/${encodeURIComponent(name)}/timetable`);
  return response.data;
};

export const fetchFacultyFreeSlots = async (name) => {
  // Endpoint updated to /faculty-data/:name/free-slots
  const response = await apiClient.get(`/faculty-data/${encodeURIComponent(name)}/free-slots`);
  return response.data;
};

export const checkHealth = async () => {
  // Health check remains at the root
  const response = await axios.get('http://localhost:5000/health');
  return response.data;
};

export default apiClient;
