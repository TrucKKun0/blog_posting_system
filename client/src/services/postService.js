import apiClient from './apiClient';

export const postService = {
  // Get all posts
  getAllPosts: async () => {
    const response = await apiClient.get('/posts');
    return response.data;
  },

  // Get single post by slug
  getPostBySlug: async (slug) => {
    const response = await apiClient.get(`/posts/${slug}`);
    return response.data;
  },

  // Create new post
  // Backend expects: title, category, status, content
  // Image field: postImage (multipart)
  createPost: async (postData, imageFile = null) => {
    const formData = new FormData();
    
    // Only send the fields backend expects
    if (postData.title) formData.append('title', postData.title);
    if (postData.category) formData.append('category', postData.category);
    if (postData.status) formData.append('status', postData.status);
    if (postData.content) formData.append('content', postData.content);
    
    if (imageFile) {
      formData.append('postImage', imageFile);
    }

    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update post
  // Backend expects: title, category
  // Image field: postImage (multipart)
  updatePost: async (postId, postData, imageFile = null) => {
    const formData = new FormData();
    
    // Only send the fields backend expects for update
    if (postData.title) formData.append('title', postData.title);
    if (postData.category) formData.append('category', postData.category);
    
    if (imageFile) {
      formData.append('postImage', imageFile);
    }

    const response = await apiClient.put(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Publish post
  // Backend expects: title, category, content
  // Image field: postImage (multipart)
  publishPost: async (postId, postData = {}, imageFile = null) => {
    const formData = new FormData();
    
    // Send the fields backend expects for publish
    if (postData.title) formData.append('title', postData.title);
    if (postData.category) formData.append('category', postData.category);
    if (postData.content) formData.append('content', postData.content);
    
    if (imageFile) {
      formData.append('postImage', imageFile);
    }

    const response = await apiClient.post(`/posts/${postId}/publish`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/delete`);
    return response.data;
  },
};
