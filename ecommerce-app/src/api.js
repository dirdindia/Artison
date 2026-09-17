import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://localhost:5000/api'; // Local URL for Web Testing
// const baseURL = 'https://api.kala-kosh.co.in/api'; // Live URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid, clear it
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // NOTE: Redirection logic should be handled by your App's Auth context or navigation reference
        // since window.location.href doesn't work in React Native.
      } catch (e) {
        console.error('Error removing token during 401:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
