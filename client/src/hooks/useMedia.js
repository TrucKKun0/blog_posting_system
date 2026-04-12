import { useState, useCallback } from 'react';
import { mediaService } from '../services';

export const useMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadMedia = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mediaService.uploadMedia(file);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload media');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadMedia,
    loading,
    error,
  };
};
