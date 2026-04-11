const ProcessedEvent = require("../models/processEvent");
const logger = require("../utils/logger");
const PostReferenceModel = require("../models/postReference");
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

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }
    const postId = data.targetId;

    const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
    if (alreadyProcessed) {
      logger.info(`Duplicate like event ignored: ${eventId}`);
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

    const result = await PostReferenceModel.updateOne(
      eventType === "like.deleted"
        ? { postId, likeCount: { $gt: 0 } }
        : { postId },
      updateQuery
    );

    // ✅ SAME BEHAVIOR AS COMMENT HANDLER
    if (result.matchedCount === 0) {
      logger.warn(`Post reference not found for postId: ${postId}`);
      return;
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
