import apiClient from './apiClient';

export const interactionService = {
  // Post a comment
  // Backend expects: postId, content
  postComment: async (commentData) => {
    const response = await apiClient.post('/interactions/comment', {
      postId: commentData.postId,
      content: commentData.content,
    });
    return response.data;
  },

  // Reply to a comment
  // Backend expects: commentId, content
  replyToComment: async (replyData) => {
    const response = await apiClient.post('/interactions/replyComment', {
      commentId: replyData.commentId,
      content: replyData.content,
    });
    return response.data;
  },

  // Like a post or comment
  // Backend expects: targetId, targetType (e.g., 'post' or 'comment')
  likePost: async (likeData) => {
    const response = await apiClient.post('/interactions/like', {
      targetId: likeData.targetId,
      targetType: likeData.targetType || 'post',
    });
    return response.data;
  },

  // Delete a comment
  // Backend expects: commentId
  deleteComment: async (commentData) => {
    const response = await apiClient.post('/interactions/deleteComment', {
      commentId: commentData.commentId,
    });
    return response.data;
  },

  // Get comments for a post
  // Backend expects: postId (query param)
  getComments: async (postId) => {
    const response = await apiClient.get('/interactions/getComments', { 
      params: { postId } 
    });
    return response.data;
  },
};
