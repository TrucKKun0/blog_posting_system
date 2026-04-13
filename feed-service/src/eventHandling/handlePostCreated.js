const logger = require("../utils/logger");
const PostReferenceModel = require("../models/postReference");
const { handlePostPushToFeed } = require("./handlePostPushToFeed");
const SocialReference = require("../models/socialReference");
const axios = require('axios');

const handlePostEvent = async (event) => {
  try {
    logger.info(`Raw event received: ${JSON.stringify(event)}`);
    const { eventType, postId, authorId, authorName } = event;

    logger.info(
      `Received event: ${eventType} → postId: ${postId}, authorId: ${authorId}, authorName: ${authorName}`,
    );

    if (eventType === "post.published") {
      const { content, mediaUrl, slug, title } = event;
      
      // Fetch avatar URL from profile service
      let avatarUrl = null;
      try {
        const profileResponse = await axios.get(
          `http://localhost:3002/api/profile/${authorId}`,
          { headers: { 'x-user-id': authorId } }
        );
        if (profileResponse.data && profileResponse.data.data && profileResponse.data.data.avatarUrl) {
          avatarUrl = profileResponse.data.data.avatarUrl;
        }
      } catch (error) {
        logger.error(`Failed to fetch avatar for author ${authorId}: ${error.message}`);
      }

      // Always create PostReference entry for all posts, not just those with followers
      await PostReferenceModel.findOneAndUpdate(
        { postId, authorId },
        { $setOnInsert: { postId, authorId, authorName: authorName || 'Unknown', authorAvatarUrl: avatarUrl, title: title || 'Untitled', content, mediaUrl, slug } },
        { upsert: true},
      );
      logger.info(
        `Created post reference: postId: ${postId}, authorId: ${authorId}, authorName: ${authorName}, title: ${title} and slug: ${slug}`,
      );

      const followers = await SocialReference.find({ followingId: authorId });

      if (followers.length > 0) {
        await handlePostPushToFeed(event);
        logger.info(`Post pushed to feed (followers exist)`);
      } else {
        logger.info(`Post not pushed to feed (no followers)`);
      }
    } else if (eventType === "post.deleted") {
      const result = await PostReferenceModel.deleteOne({ postId });
      if (result.deletedCount > 0) {
        logger.info(`Deleted post reference: postId: ${postId}`);
      } else {
        logger.warn(`Post reference not found for deletion: postId: ${postId}`);
      }
    }
  } catch (error) {
    logger.error(`Error handling post event: ${error.message}`);
  }
};

module.exports = { handlePostEvent };
