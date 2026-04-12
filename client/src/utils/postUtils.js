/**
 * Utility functions for handling post data display
 */

/**
 * Check if post has an image
 * @param {Object} post - Post object from backend
 * @returns {boolean}
 */
export const hasPostImage = (post) => {
  return post?.postImageUrl && post.postImageUrl.length > 0;
};

/**
 * Get display image URL or fallback
 * @param {Object} post - Post object from backend
 * @param {string} fallback - Fallback URL if no image
 * @returns {string}
 */
export const getPostImageUrl = (post, fallback = '') => {
  return hasPostImage(post) ? post.postImageUrl : fallback;
};

/**
 * Get author display name
 * @param {Object} post - Post object from backend
 * @returns {string}
 */
export const getAuthorName = (post) => {
  return post?.authorId?.name || post?.authorName || 'Unknown Author';
};

/**
 * Get author avatar URL
 * @param {Object} post - Post object from backend
 * @param {string} fallback - Fallback avatar URL
 * @returns {string}
 */
export const getAuthorAvatar = (post, fallback) => {
  return post?.authorId?.avatarUrl || post?.authorAvatar || fallback;
};

/**
 * Get post display date
 * @param {Object} post - Post object from backend
 * @returns {Date|string}
 */
export const getPostDate = (post) => {
  return post?.publishedAt || post?.createdAt || new Date();
};

/**
 * Format post content for preview
 * @param {string} content - Post content
 * @param {number} maxLength - Maximum length for preview
 * @returns {string}
 */
export const formatContentPreview = (content, maxLength = 150) => {
  if (!content) return 'No content available';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};
