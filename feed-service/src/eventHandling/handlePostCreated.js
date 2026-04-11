const logger = require("../utils/logger");
const PostReferenceModel = require("../models/postReference");
const { handlePostPushToFeed } = require("./handlePostPushToFeed");
const SocialReference = require("../models/socialReference");

const handlePostEvent = async (event) => {
  try {
    const { eventType, postId, authorId } = event;

    logger.info(
      `Received event: ${eventType} → postId: ${postId}, authorId: ${authorId}`,
    );

    if (eventType === "post.published") {
      const followers = await SocialReference.find({ followingId: authorId });

      if (followers.length > 0) {
        await handlePostPushToFeed(event);
        logger.info(`Post pushed to feed (followers exist)`);
      } else {
        logger.info(`Post not pushed (no followers)`);
      }
      const { content, mediaUrl } = event;
      await PostReferenceModel.findOneAndUpdate(
        { postId, authorId },
        { $setOnInsert: { postId, authorId, content, mediaUrl } },
        { upsert: true},
      );
      logger.info(
        `Created post reference: postId: ${postId}, authorId: ${authorId}`,
      );
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
