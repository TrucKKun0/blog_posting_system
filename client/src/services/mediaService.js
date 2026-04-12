import apiClient from './apiClient';

export const mediaService = {
  // Upload media file
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
