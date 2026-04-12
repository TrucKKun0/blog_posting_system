import apiClient from './apiClient';

export const socialService = {
  // Follow a user
  followUser: async (userId) => {
    const response = await apiClient.post(`/social/follow/${userId}`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await apiClient.post(`/social/unfollow/${userId}`);
    return response.data;
  },
};
