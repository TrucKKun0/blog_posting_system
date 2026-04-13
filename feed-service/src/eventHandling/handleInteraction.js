const ProcessedEvent = require("../models/processEvent");
const logger = require("../utils/logger");
const PostReferenceModel = require("../models/postReference");
const UserLikeReference = require("../models/userLikeReference");
const { calculateTrendingSocre } = require("../utils/calculateTrendingScore");

const handleCommentEvent = async (event) => {
  logger.info(`Handling comment event: ${event.eventType} for postId: ${event.data?.targetId}`);
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    // ✅ idempotency
    const existing = await ProcessedEvent.findOne({ eventId });
    if (existing) {
      logger.info(`Duplicate comment event ignored: ${eventId}`);
      return;
    }

    const postId = data.targetId;

    let updateQuery;

    if (eventType === "comment.created") {
      updateQuery = { $inc: { commentCount: 1 } };
    } else if (eventType === "comment.deleted") {
      updateQuery = { $inc: { commentCount: -1 } };
    } else {
      return;
    }

    const result = await PostReferenceModel.updateOne(
      eventType === "comment.deleted"
        ? { postId, commentCount: { $gt: 0 } }
        : { postId },
      updateQuery
    );

    if (result.matchedCount === 0) {
      logger.warn(`Post not found: ${postId}`);
      return;
    }

    // ✅ safe insert
    await ProcessedEvent.updateOne(
      { eventId },
      { $setOnInsert: { eventId } },
      { upsert: true }
    );
      await calculateTrendingSocre(postId);
    logger.info(`Comment count updated for postId: ${data.targetId}`);

  } catch (error) {
    console.error("FULL ERROR:", error);
    logger.error("Error handling comment event", {
      error: error.message,
      event,
    });
  }
};

const handleLikeEvent = async (event) => {
  logger.info(`Handling like event: ${event.eventType} for postId: ${event.data?.targetId}`);
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType || !data?.userId) {
      logger.error("Invalid event payload", { event });
      return;
    }
    const postId = data.targetId;
    const userId = data.userId;

    const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
    if (alreadyProcessed) {
      logger.info(`Duplicate like event ignored: ${eventId}`);
      return;
    }

    let updateQuery;

    if (eventType === "like.created") {
      updateQuery = { $inc: { likeCount: 1 } };
      // Store user like reference
      const result = await UserLikeReference.findOneAndUpdate(
        { userId, targetId: postId, targetType: 'post' },
        { userId, targetId: postId, targetType: 'post' },
        { upsert: true, new: true }
      );
      logger.info(`User like reference created for userId: ${userId}, postId: ${postId}, result: ${result}`);
    } else if (eventType === "like.deleted") {
      updateQuery = { $inc: { likeCount: -1 } };
      // Remove user like reference
      await UserLikeReference.deleteOne({ userId, targetId: postId, targetType: 'post' });
      logger.info(`User like reference deleted for userId: ${userId}, postId: ${postId}`);
    } else {
      logger.warn(`Unknown eventType: ${eventType}`);
      return;
    }

    const result = await PostReferenceModel.updateOne(
      eventType === "like.deleted"
        ? { postId, likeCount: { $gt: 0 } }
        : { postId },
      updateQuery
    );

    // PostReference update is optional - like status is stored in UserLikeReference
    if (result.matchedCount === 0) {
      logger.info(`Post reference not found for postId: ${postId} (optional for like tracking)`);
      // Continue without error - like status is already stored in UserLikeReference
    }

     await ProcessedEvent.updateOne(
      { eventId },
      { $setOnInsert: { eventId } },
      { upsert: true }
    );
      await calculateTrendingSocre(postId);
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
