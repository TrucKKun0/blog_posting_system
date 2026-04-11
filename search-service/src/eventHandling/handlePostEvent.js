const logger = require('../utils/logger');
const PostReference = require('../models/postReferenceModel');
const ProcessedEvent = require('../models/processEvent');

const handlePostEvent = async (event) => { 
  try {
    const { eventType, postId, authorId } = event;

    logger.info(
      `Received event: ${eventType} → postId: ${postId}, authorId: ${authorId}`,
    );
    const eventId = event.eventId;
    const existing = await ProcessedEvent.findOne({ eventId });
    if (existing) {
      logger.info(`Duplicate post event ignored: ${eventId}`);
      return;
    }

    if (eventType === "post.published") {
      const { content, mediaUrl } = event;
      await PostReference.findOneAndUpdate(
        { postId, authorId },
        { $setOnInsert: { postId, authorId, content, mediaUrl } },
        { upsert: true},
      );
      logger.info(
        `Created post reference: postId: ${postId}, authorId: ${authorId}`,
      );
    } else if (eventType === "post.deleted") {
      const result = await PostReference.deleteOne({ postId });
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

module.exports = {handlePostEvent};