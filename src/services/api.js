import axios from 'axios';
import { auth } from '../firebase/config';

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

/**
 * Check user role and get full profile data
 */
export const checkUserRole = async () => {
    try {
        const response = await apiClient.get('/me');
        // The backend returns { success, uid, email, displayName, role, ... }
        return response.data;
    } catch (error) {
        console.error("API /me fetch error:", error);
        throw error;
    }
};

export const getDashboardData = async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
};

export default apiClient;
