const logger = require('../logger');
const ProcessedEvent = require('../models/processEvent');
const PostReference = require('../models/postReferenceModel');
const handleCommentEvent = async (event) => {
  try {
    const { eventId, data, eventType } = event;

    if (!data?.targetId || !eventType) {
      logger.error("Invalid event payload", { event });
      return;
    }

    // check if postId does belong to search service
    const {postId} = data.targetId;
    const existingPost = await Post.findOne({ postId });
    if (!existingPost) {
      logger.warn(`Post not found for comment event, ignoring: ${data.targetId}`);
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
    const result = await PostReference.updateOne(
      eventType === "comment.deleted"
        ? { _id: existingPost._id, commentCount: { $gt: 0 } }
        : { _id: existingPost._id },
      updateQuery,
    );

    // ❗ Retry if post not found
    if (result.matchedCount === 0) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      throw new Error("RETRY_EVENT");
    }

    // ✅ Mark event as processed
    await ProcessedEvent.create({ eventId });

    logger.info(`Comment count updated for postId: ${data.targetId}`);
  } catch (error) {
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
    // check if postId does belong to search service
    const {postId} = data.targetId;
    const existingPost = await Post.findOne({ postId });
    if (!existingPost) {
      logger.warn(`Post not found for comment event, ignoring: ${data.targetId}`);
      return;
    }
   
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

    // ✅ Use _id instead of postId
    const updatedPost = await   PostReference.findOneAndUpdate(
      eventType === "like.deleted"
        ? { _id: existingPost._id, likeCount: { $gt: 0 } }
        : { _id: existingPost._id },
      updateQuery,
      { new: true },
    );

    if (!updatedPost) {
      logger.warn(`Post not found, retrying: ${data.targetId}`);
      return;
    }

    logger.info("Updated Post:", updatedPost);

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