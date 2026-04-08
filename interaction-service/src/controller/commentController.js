const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const PostRefrence = require("../models/postRefrenceModel");
const Comment = require("../models/commentModel");
const InteractionCount = require("../models/interactionCountModel");
const OutBox = require("../models/OutBoxModel");
const mongoose = require("mongoose");


// =======================
// POST COMMENT
// =======================
const postComment = async (req, res) => {
    logger.info("Post comment endpoint hit");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { postId, content } = req.body;

        // ✅ Validation
        if (!postId || !content) {
            return res.status(400).json({
                success: false,
                message: "postId and content are required"
            });
        }

        // ✅ Check post exists
        const foundPost = await PostRefrence.findOne({ postId }).session(session);

        if (!foundPost) {
            await session.abortTransaction();
            session.endSession();

            logger.error(`Post not found with postId ${postId}`);

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const { userId } = req.user;
        const eventId = uuidv4();
        const targetType = "post";

        // ✅ Create comment
        const newCommentArr = await Comment.create([{
            userId,
            targetId: postId,
            targetType,
            content
        }], { session });

        const newComment = newCommentArr[0];

        // ✅ Update interaction count
        await InteractionCount.updateOne(
            { targetId: postId, targetType },
            { $inc: { commentCount: 1 } },
            { upsert: true, session }
        );

        // ✅ Create outbox event
        await OutBox.create([{
            eventId,
            eventType: "comment.created",
            payload: {
                commentId: newComment._id,
                userId,
                targetId: postId,
                targetType,
                content
            }
        }], { session });

        // ✅ Commit
        await session.commitTransaction();
        session.endSession();

        logger.info(`Comment created successfully ${newComment._id}`);

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: newComment
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        logger.error(`Error while posting comment: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =======================
// REPLY TO COMMENT
// =======================
const replyToComment = async (req, res) => {
    logger.info("Reply to comment endpoint hit");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { commentId, content } = req.body;

        // ✅ Validation
        if (!commentId || !content) {
            return res.status(400).json({
                success: false,
                message: "commentId and content are required"
            });
        }

        // ✅ Check parent comment
        const parentComment = await Comment.findOne({ _id: commentId }).session(session);

        if (!parentComment) {
            await session.abortTransaction();
            session.endSession();

            logger.error(`Comment not found with id ${commentId}`);

            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const { userId } = req.user;
        const eventId = uuidv4();
        const targetType = "comment";

        // ✅ Create reply
        const replyArr = await Comment.create([{
            userId,
            targetId: parentComment._id,
            targetType,
            content,
            parentCommentId: parentComment._id
        }], { session });

        const newReply = replyArr[0];

        // ✅ Increase reply count in parent
        await Comment.updateOne(
            { _id: parentComment._id },
            { $inc: { replyCount: 1 } },
            { session }
        );

        // ✅ Update interaction count
        await InteractionCount.updateOne(
            { targetId: parentComment._id, targetType: "comment" },
            { $inc: { commentCount: 1 } },
            { upsert: true, session }
        );

        // ✅ Outbox event
        await OutBox.create([{
            eventId,
            eventType: "comment.reply",
            payload: {
                commentId: newReply._id,
                userId,
                targetId: parentComment._id,
                targetType,
                content,
                parentCommentId: parentComment._id
            }
        }], { session });

        // ✅ Commit
        await session.commitTransaction();
        session.endSession();

        logger.info(`Reply created successfully ${newReply._id}`);

        return res.status(201).json({
            success: true,
            message: "Reply created successfully",
            data: newReply
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        logger.error(`Error while replying: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const deleteComment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { commentId } = req.body;
        const { userId } = req.user;

        if (!commentId) {
            logger.error("commentId is required for deletion");
            return res.status(400).json({
                success: false,
                message: "commentId is required"
            });
           
        }

        const comment = await Comment.findById(commentId).session(session);

        if (!comment) {
            session.abortTransaction();
            session.endSession();
            logger.error(`Comment not found with id ${commentId}`);
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.userId.toString() !== userId) {
            session.abortTransaction();
            session.endSession();
            logger.error(`Unauthorized delete attempt by user ${userId} on comment ${commentId}`);
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            });
        }

        if (comment.isDeleted) {
            session.abortTransaction();
            session.endSession();
            logger.error(`Comment is already deleted with id ${commentId}`);
            return res.status(400).json({
                success: false,
                message: "Comment is already deleted"
            });
        }

        // Soft delete
        comment.isDeleted = true;
        comment.content = "This comment has been deleted";
        comment.deletedAt = new Date();

        await comment.save({ session });

        // Update post comment count
        await InteractionCount.updateOne(
            { targetId: comment.targetId, targetType: comment.targetType },
            { $inc: { commentCount: -1 } },
            { session }
        );

        // Update parent reply count
        if (comment.parentCommentId) {
            await Comment.updateOne(
                { _id: comment.parentCommentId },
                { $inc: { replyCount: -1 } },
                { session }
            );
        }

        // Outbox event
        await OutBox.create([{
            eventId: uuidv4(),
            eventType: "comment.deleted",
            payload: {
                commentId: comment._id,
                userId: comment.userId,
                targetId: comment.targetId,
                targetType: comment.targetType
            }
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error while deleting comment: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    postComment,
    replyToComment,
    deleteComment
};