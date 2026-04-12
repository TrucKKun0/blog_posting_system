import { useState, useCallback } from 'react';
import { feedService } from '../services';

export const useFeed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedData, setFeedData] = useState(null);

  const getFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedService.getFeed();
      setFeedData(response);
      return response;
    } catch (err) {
      console.error('Feed fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch feed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getFeed,
    loading,
    error,
    feedData,
  };
};
