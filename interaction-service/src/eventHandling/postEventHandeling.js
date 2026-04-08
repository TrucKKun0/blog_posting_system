const logger = require('../utils/logger');
const PostRefrence = require('../models/postRefrenceModel');
const OutBox = require('../models/OutBoxModel');
const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');
const handlePostCreation = async (event) => {

    const session = await mongoose.startSession();

    session.startTransaction();
    try {

        const eventId = uuidv4();

        await PostRefrence.create([{
            postId: event.postId,
            createdAt: new Date()
        }], { session });

        await OutBox.create([{
            eventId,
            eventType: "post.published",
            payload: { postId: event.postId },
            createdAt: new Date()
        }], { session });

        await session.commitTransaction();

        logger.info(`Post reference created: ${event.postId}`);

    } catch (error) {
        await session.abortTransaction();

        if (error.code === 11000) {
            logger.info(`Duplicate event ignored: ${event.postId}`);
            return;
        }

        logger.error(`Error handling post creation`, {
            error: error.message,
            stack: error.stack
        });

    } finally {
        session.endSession();
    }
}; 
const handlePostDeletion = async (event) => {
    if (!event?.postId) {
        logger.error('Invalid event payload', { event });
        return;
    }

    const session = await mongoose.startSession();

    session.startTransaction();
    try {

        const { postId } = event;
        const eventId = uuidv4();

        logger.info(`Handling post deletion for postId: ${postId}`);

        const result = await PostRefrence.deleteOne({ postId }, { session });

        if (result.deletedCount === 0) {
            logger.warn(`No post found for deletion: ${postId}`);
            await session.abortTransaction();
            return;
        }

        await OutBox.create([{
            eventId,
            eventType: "post.deleted",
            payload: { postId },
            status: "pending",
            createdAt: new Date()
        }], { session });

        await session.commitTransaction();

        logger.info(`Post deletion handled successfully: ${postId}`);

    } catch (error) {
        await session.abortTransaction();

        logger.error(`Error handling post deletion`, {
            error: error.message,
            stack: error.stack,
            event
        });

    } finally {
        session.endSession();
    }
};

module.exports = {
    handlePostCreation,
    handlePostDeletion
}