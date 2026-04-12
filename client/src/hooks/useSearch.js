import { useState, useCallback } from 'react';
import { searchService } from '../services';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPosts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchService.searchPosts(query);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchPosts,
    loading,
    error,
  };
};
