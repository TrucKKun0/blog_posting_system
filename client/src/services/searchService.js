import apiClient from './apiClient';

export const searchService = {
  // Search posts
  searchPosts: async (query) => {
    const response = await apiClient.get('/search', { params: { q: query } });
    return response.data;
  },
};
