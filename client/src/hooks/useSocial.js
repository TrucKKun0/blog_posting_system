import { useState, useCallback } from 'react';
import { socialService } from '../services';

export const useSocial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const followUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await socialService.followUser(userId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to follow user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await socialService.unfollowUser(userId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unfollow user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    followUser,
    unfollowUser,
    loading,
    error,
  };
};
