const logger = require("../utils/logger");
const PostRefrence = require("../models/postRefrenceModel");
const Comment = require("../models/commentModel");
const InteractionCount = require("../models/interactionCountModel");
const OutBox = require("../models/OutBoxModel");
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const postComment = async(req,res)=>{
    logger.info("Post comment endpoint hit");
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {postId} = req.params;
        //Check whether post exits or not 
        const foundPost = await PostRefrence.findOne({postId}).session(session);
        //if post not found then abort the transaction and end the session
        if(!foundPost){ 
            await session.abortTransaction();
            session.endSession();
            logger.error(`Post not found with postid ${postId}`);
            return res.status(401).json({ 
                success : "false",
                message : "Post not found"
            });
        }

        const {userId} = req.user;
        const eventId = uuidv4();
        const targetId = postId;
        const {content} = req.body;
        const targetType = "post";
        //create comment
        const newComment = await Comment.create([{
            userId,
            targetId,
            targetType,
            content
        }],{session});
        //Update interaction count
        await InteractionCount.updateOne(
            {targetId, targetType},
            {$inc : {commentCount : 1}},
            {upsert : true,session}
        );
        //create outbox event to publish event
        await OutBox.create([{
            eventId,
            eventType : 'comment.created',
            payload : {
                commentId : newComment._id,
                userId,
                targetId,
                targetType,
                content
            }
        }],{session});
        //commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();

        logger.info(`Comment created successfully ${newComment._id}`);
        res.status(200).json({
            success : true,
            message : "Comment created successfully",
            data : newComment
        });


    }catch(error){
        await session.abortTransaction();
        session.endSession();
        logger.error("Error while posting comment".error.details[0]);
        return res.status(401).json({
            success : "false",
            message : "Error while posting comment"
        })
    }
}
const replyToComment = async (req,res)=>{
    logger.info("Reply to comment endpoint hit");
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {commentId} = req.params;

        const parentComment = await Comment.findOne({_id : commentId}).session(session);
        //check wheather or not a comment exits
        if(!parentComment){
            await session.abordTransaction();
            session.endSession();
            logger.error(`Comment not found with commentID : ${commentId}`);
            return res.status(404).json({
                success : "false",
                message : "Comment not found"
            });
        }
        const {userId} = req.user;
        const {content} = req.body;
        const eventId = uuidv4();
        const targetType= "comment";

        //Create reply comment

        const newReplyComment = await Comment.create([{
            userId,
            targetId : parentComment._id,
            targetType,
            content,
            parentCommentId : parentComment._id
        }],{session});

        //increase parent comment reply counter by 1
        await Comment.updateOne({_id : parentComment._id},
            {$inc : {replyCount : 1}},
            {session}
        )
        //increase overall interaction count 

        await Comment.updateOne({targetId : parentComment._id , targetType : "comment"},
            {$inc : {commentCount : 1}},
            {upsert : true, session}
        )

        //create outbox event to publish event
        await OutBox.create([
            {
                eventId,
                eventType : 'comment.reply',
                payload : {
                    commentId : newReplyComment._id,
                    userId,
                    targetId : parentComment._id,
                    targetType,
                    content,
                    parentCommentId : parentComment._id
                }
            }
        ])

        await session.commitTransaction();
        session.endSession();

        logger.info(`Reply created successfully ${newReplyComment._id}`);
        res.status(200).json({
            success : true,
            message : "Reply comment created successfully",
            data : newReplyComment
        });

    }catch (error){
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error while replying to comment ${error.message}`);
        return res.status(500).json({
            success : "false",
            message : "Internal Server Error"
        })
    }
}

module.exports = {postComment,replyToComment};