import apiClient from './apiClient';

export const feedService = {
  // Get user's feed
  getFeed: async () => {
    const response = await apiClient.get('/feed');
    return response.data;
  },
};
