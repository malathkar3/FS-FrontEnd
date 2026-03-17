import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadTimetable = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/upload-timetable/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchFacultyList = async () => {
  const response = await apiClient.get('/faculty');
  return response.data;
};

export const fetchFacultyTimetable = async (name) => {
  const response = await apiClient.get(`/faculty/${encodeURIComponent(name)}/timetable`);
  return response.data;
};

export const fetchFacultyFreeSlots = async (name) => {
  const response = await apiClient.get(`/faculty/${encodeURIComponent(name)}/free-slots`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await axios.get('http://localhost:5000/health');
  return response.data;
};
