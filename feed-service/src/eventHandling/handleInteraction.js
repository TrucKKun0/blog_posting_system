const ProcessedEvent = require("../models/processEvent");
const logger = require("../utils/logger");
const PostRefrence = require("../models/postReference");

const handleCommentEvent = async (event) => {
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    // ✅ Idempotency check
    const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
    if (alreadyProcessed) {
      logger.info(`Duplicate event ignored: ${eventId}`);
      return;
    }
    const postId = data.targetId;
    const postRef = await PostRefrence.findOne({ postId });
    if (!postRef) {
      logger.warn(`Post reference not found for postId: ${postId}`);
      return;
    }

    let updateQuery;

    if (eventType === "comment.created") {
      updateQuery = { $inc: { commentCount: 1 } };
    } else if (eventType === "comment.deleted") {
      updateQuery = { $inc: { commentCount: -1 } };
    } else {
      logger.warn(`Unknown eventType: ${eventType}`);
      return;
    }

    const result = await PostRefrence.updateOne(
      eventType === "comment.deleted"
        ? { postId, commentCount: { $gt: 0 } }
        : { postId },
      updateQuery,{
        upsert: true, // Create document if it doesn't exist
      }
    );

    // ❗ Retry if post not found
    if (result.matchedCount === 0) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      return;
    }

    await ProcessedEvent.create({ eventId });

    logger.info(`Comment count updated for postId: ${data.targetId}`);
  } catch (error) {
    logger.error("Error handling comment event", {
      error: error.message,
      event,
    });
  }
};

const handleLikeEvent = async (event) => {
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    const postId = data.targetId;

    const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
    if (alreadyProcessed) {
      logger.info(`Duplicate event ignored: ${eventId}`);
      return;
    }

    let updateQuery;

    if (eventType === "like.created") {
      updateQuery = { $inc: { likeCount: 1 } };
    } else if (eventType === "like.deleted") {
      updateQuery = { $inc: { likeCount: -1 } };
    } else {
      logger.warn(`Unknown eventType: ${eventType}`);
      return;
    }

    const result = await PostRefrence.updateOne(
      eventType === "like.deleted"
        ? { postId, likeCount: { $gt: 0 } }
        : { postId },
      updateQuery,
      {
        upsert: true, // Create document if it doesn't exist
      }
    );

    // ✅ SAME BEHAVIOR AS COMMENT HANDLER
    if (result.matchedCount === 0) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      return;
    }

    await ProcessedEvent.create({ eventId });

    logger.info(`Like count updated for postId: ${data.targetId}`);
  } catch (error) {
    logger.error("Error handling like event", {
      error: error.message,
      event,
    });

    
  }
};

module.exports = {
  handleCommentEvent,
  handleLikeEvent,
};
