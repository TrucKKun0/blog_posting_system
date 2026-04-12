const Post = require("../models/postModel");
const ProcessedEvent = require("../models/processEvent");
const logger = require("../utils/logger");

const mongoose = require("mongoose");

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (err) {
    return null;
  }
};

const handleCommentEvent = async (event) => {
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    // ✅ Convert to ObjectId
    const postObjectId = toObjectId(data.targetId);

    if (!postObjectId) {
      logger.error("Invalid postId format", { targetId: data.targetId });
      return;
    }

    // ✅ Idempotency check
    const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
    if (alreadyProcessed) {
      logger.info(`Duplicate event ignored: ${eventId}`);
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

    // ✅ Use _id instead of postId
    const result = await Post.updateOne(
      eventType === "comment.deleted"
        ? { _id: postObjectId, commentCount: { $gt: 0 } }
        : { _id: postObjectId },
      updateQuery,
    );

    // ❗ Retry if post not found
    if (result.matchedCount === 0) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      throw new Error("RETRY_EVENT");
    }

  await ProcessedEvent.updateOne(
        { eventId },
        { $setOnInsert: { eventId } },
        { upsert: true }
      );

    logger.info(`Comment count updated for postId: ${data.targetId}`);
  } catch (error) {
    // ✅ Gracefully handle duplicate key errors (idempotency)
    if (error.code === 11000 || error.codeName === 'DuplicateKey') {
      logger.info(`Duplicate comment event ignored: ${event?.eventId}`);
      return;
    }

    logger.error("Error handling comment event", {
      error: error.message,
      event,
    });

    // ❗ IMPORTANT → allow retry
    throw error;
  }
};

const handleLikeEvent = async (event) => {
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    // ✅ Convert to ObjectId
    const postObjectId = toObjectId(data.targetId);

    if (!postObjectId) {
      logger.error("Invalid postId format", { targetId: data.targetId });
      return;
    }

    // ✅ Idempotency check
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

    const result = await Post.updateOne(
      eventType === "like.deleted"
        ? { _id: postObjectId, likeCount: { $gt: 0 } }
        : { _id: postObjectId },
      updateQuery
    );

    // ✅ SAME BEHAVIOR AS COMMENT HANDLER
    if (result.matchedCount === 0) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      throw new Error("RETRY_EVENT"); // 🔥 IMPORTANT
    }

    await ProcessedEvent.updateOne(
      { eventId },
      { $setOnInsert: { eventId } },
      { upsert: true }
    );

    logger.info(`Like count updated for postId: ${data.targetId}`);

  } catch (error) {
    // ✅ Gracefully handle duplicate key errors (idempotency)
    if (error.code === 11000 || error.codeName === 'DuplicateKey') {
      logger.info(`Duplicate like event ignored: ${event?.eventId}`);
      return;
    }

    logger.error("Error handling like event", {
      error: error.message,
      event,
    });

    // 🔥 MUST THROW FOR RETRY
    throw error;
  }
};

module.exports = {
  handleCommentEvent,
  handleLikeEvent,
};
