import { useState, useCallback } from 'react';
import { interactionService } from '../services';

export const useInteractions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postComment = useCallback(async (commentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await interactionService.postComment({
        postId: commentData.postId,
        content: commentData.content,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const replyToComment = useCallback(async (replyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await interactionService.replyToComment({
        commentId: replyData.commentId,
        content: replyData.content,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reply to comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (likeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await interactionService.likePost({
        targetId: likeData.targetId,
        targetType: likeData.targetType,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (commentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await interactionService.deleteComment({
        commentId: commentData.commentId,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComments = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await interactionService.getComments(postId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postComment,
    replyToComment,
    likePost,
    deleteComment,
    getComments,
    loading,
    error,
  };
};
