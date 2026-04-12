import React from 'react';

/**
 * Component to conditionally display post image or return null
 * @param {Object} props
 * @param {string} props.imageUrl - Cloudinary image URL from backend (postImageUrl)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.alt - Alt text for image
 * @param {boolean} props.showPlaceholder - If true, shows placeholder when no image (default: false)
 * @param {string} props.content - Content to show in placeholder (only if showPlaceholder is true)
 */
export const PostImage = ({ imageUrl, className = '', alt = 'Post Image', showPlaceholder = false, content = '' }) => {
  const hasImage = imageUrl && imageUrl.length > 0;

  if (!hasImage && !showPlaceholder) {
    return null; // Don't render anything if no image and placeholder not requested
  }

  if (hasImage) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // Show content preview only if showPlaceholder is true
  return (
    <div className={`w-full h-full flex items-center justify-center p-4 bg-gray-50 ${className}`}>
      <p className="text-gray-600 text-center line-clamp-4">
        {content || 'No content available'}
      </p>
    </div>
  );
};

/**
 * Component for displaying post card with conditional image/content
 * @param {Object} props
 * @param {Object} props.post - Post object from backend response
 * @param {string} props.className - Additional CSS classes
 */
export const PostCardImage = ({ post, className = '' }) => {
  return (
    <PostImage
      imageUrl={post.postImageUrl}
      content={post.content}
      className={className}
      alt={`${post.title} - Featured Image`}
    />
  );
};

export default PostImage;
