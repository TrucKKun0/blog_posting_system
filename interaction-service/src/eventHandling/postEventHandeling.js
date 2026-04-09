const logger = require('../utils/logger');
const PostReference = require('../models/postReferenceModel');

const handlePostCreation = async (event) => {
    if (!event?.postId) {
        logger.error('Invalid event payload for post creation', { event });
        return;
    }

    try {
        await PostReference.create({
            postId: event.postId,
            createdAt: new Date()
        });

        logger.info(`Post reference created: ${event.postId}`);

    } catch (error) {
        if (error.code === 11000) {
            logger.info(`Duplicate event ignored: ${event.postId}`);
            return;
        }

        logger.error(`Error handling post creation`, {
            error: error.message,
            stack: error.stack
        });
    }
};

const handlePostDeletion = async (event) => {
    const postId = event?.postId ?? event?.data?.postId;

    if (!postId) {
        logger.error('Invalid event payload for post deletion', { event });
        return;
    }

    try {
        logger.info(`Handling post deletion for postId: ${postId}`);

        const result = await PostReference.deleteOne({ postId });

        if (result.deletedCount === 0) {
            logger.warn(`No post found for deletion: ${postId}`);
            return;
        }

        logger.info(`Post deletion handled successfully: ${postId}`);

    } catch (error) {
        logger.error(`Error handling post deletion`, {
            error: error.message,
            stack: error.stack,
            event
        });
    }
};

module.exports = {
    handlePostCreation,
    handlePostDeletion
};