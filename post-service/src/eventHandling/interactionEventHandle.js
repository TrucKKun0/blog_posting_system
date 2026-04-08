const logger = require("../utils/logger");
const Post = require("../models/postModel");
const ProcessedEvent = require("../models/processEvent");

const handleCommentEvent = async (event) => {
    try {
        const { eventId, payload } = event;

        if (!payload?.targetId || !payload?.eventType) {
            logger.error("Invalid event payload", { event });
            return;
        }

        const { targetId: postId, eventType } = payload;

        // Idempotency check
        const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
        if (alreadyProcessed) {
            return;
        }

        let updateQuery;

        if (eventType === "comment.created") {
            updateQuery = { $inc: { commentCount: 1 } };
        } else if (eventType === "comment.deleted") {
            updateQuery = { $inc: { commentCount: -1 } };
        } else {
            return;
        }

        const result = await Post.updateOne(
            eventType === "comment.deleted"
                ? { postId, commentCount: { $gt: 0 } }
                : { postId },
            updateQuery
        );

        if (result.matchedCount === 0) {
            logger.warn(`Post not found: ${postId}`);
            return;
        }

        // Mark event processed
        await ProcessedEvent.create({ eventId });

        logger.info(`Comment count updated for postId: ${postId}`);

    } catch (error) {
        logger.error(`Error handling comment event`, {
            error: error.message,
            stack: error.stack
        });
    }
};
const handleLikeEvent = async (event) => {
    try{
        const { eventId, payload } = event;
        if (!payload?.targetId || !payload?.eventType) {
            logger.error("Invalid event payload", { event });
            return;
        }
        const { targetId: postId, eventType } = payload;
        // Idempotency check
        const alreadyProcessed = await ProcessedEvent.findOne({ eventId });
        if (alreadyProcessed) {
            return;
        }
        let updateQuery;
        if (eventType === "like.created") {
            updateQuery = { $inc: { likeCount: 1 } };
        } else if (eventType === "like.deleted") {
            updateQuery = { $inc: { likeCount: -1 } };
        } else {
            return;
        }
        const result = await Post.updateOne(
            eventType === "like.deleted"
                ? { postId, likeCount: { $gt: 0 } }
                : { postId },
            updateQuery
        );
        if (result.matchedCount === 0) {
            logger.info(`Post not found: ${postId}`);
            return;
        }
        // Mark event processed
        await ProcessedEvent.create({ eventId });
        logger.info(`Like count updated for postId: ${postId}`);

    }catch(error){
        logger.error(`Error handling like event`, {
            error : error.message,
            stack : error.stack
        });
    }
};

module.exports = {
    handleCommentEvent,
    handleLikeEvent
};