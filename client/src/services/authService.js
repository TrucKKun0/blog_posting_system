import apiClient from './apiClient';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Forget password
  forgetPassword: async (emailData) => {
    const response = await apiClient.post('/auth/forget-password', emailData);
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh-access-token', {}, {
      withCredentials: true,
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout', {}, {
      withCredentials: true,
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/auth/health-check');
    return response.data;
  },
};
