import apiClient from './apiClient';

export const profileService = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  // Backend expects: bio
  // Image field: avatar (multipart)
  updateProfile: async (profileData, avatarFile = null) => {
    const formData = new FormData();
    
    // Only send the fields backend expects
    if (profileData.bio !== undefined) formData.append('bio', profileData.bio);
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const response = await apiClient.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await apiClient.get('/profile/delete-avatar');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/profile/healthcheck');
    return response.data;
  },
};
