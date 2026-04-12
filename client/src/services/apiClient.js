import axios from 'axios';
import { store } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.user?.token || state.user?.user?.AccessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors - token refresh logic could be added here
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-access-token`, {}, {
          withCredentials: true,
        });
        
        if (response.data?.data?.AccessToken) {
          const { dispatch } = store;
          const { setUser } = await import('../redux/user/user.slice');
          
          // Update user state with new token
          const state = store.getState();
          dispatch(setUser({
            ...state.user.user,
            AccessToken: response.data.data.AccessToken,
          }));
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.data.AccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        const { dispatch } = store;
        const { removeUser } = await import('../redux/user/user.slice');
        dispatch(removeUser());
        window.location.href = '/sign-in';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
