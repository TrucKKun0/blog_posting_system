import { useState, useCallback } from 'react';
import { profileService } from '../services';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfile(userId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData, avatarFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.updateProfile(profileData, avatarFile);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAvatar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.deleteAvatar();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProfile,
    updateProfile,
    deleteAvatar,
    loading,
    error,
  };
};
