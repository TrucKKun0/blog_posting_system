import { useState, useCallback } from 'react';
import { postService } from '../services';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getAllPosts();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getPostBySlug(slug);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.createPost(postData, imageFile);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId, postData, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.updatePost(postId, postData, imageFile);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishPost = useCallback(async (postId, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.publishPost(postId, imageFile);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.deletePost(postId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllPosts,
    getPostBySlug,
    createPost,
    updatePost,
    publishPost,
    deletePost,
    loading,
    error,
  };
};
