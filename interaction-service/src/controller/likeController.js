const Like = require("../models/likeModel")
const logger = require("../utils/logger");
const InteractionCount = require("../models/interactionCountModel");
const PostRefrence = require("../models/postReferenceModel");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");
const {v4 : uuidv4} = require("uuid");
const OutBox = require("../models/OutBoxModel");

const createLike = async (req,res)=>{
    logger.info("Like creation request received");
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {targetId,targetType} = req.body;
        const {userId} = req.user;
        const eventId = uuidv4();
        // Validate required fields
        if(!targetId || !targetType){
            logger.error("Missing required fields for like creation");
            return res.status(400).json({
                success : false,
                message : "targetId and targetType are required"
            });
        }
        //Check if the target exists (for posts). If target type is post then check whether post exists or not.
        // If not then abort the transaction and end the session and return 404 not found response
        if(targetType === "post"){
           const foundPost = await PostRefrence.findOne({postId : targetId}).session(session);
           if(!foundPost){
            await session.abortTransaction();
            session.endSession();
               logger.error("Post not found");
               return res.status(404).json({
                   success : false,
                   message : "Post not found"
               });
           }
        }
        //Check if the target exists (for comments).
        if(targetType === "comment"){
            const foundComment = await Comment.findOne({_id : targetId}).session(session);
        // If comment not found then abort the transaction and end the session and return 404 not found response
            if(!foundComment){
                session.abortTransaction();
                session.endSession();
                logger.error("Comment not found");
                return res.status(404).json({
                    success : false,
                    message : "Comment not found"
                });
            }
        }

        // Check if the like already exists and if yes, remove it (toggle behavior)
        const existingLike  = await Like.findOne({userId, targetId,targetType}).session(session);
        if(existingLike){
            await Like.deleteOne({_id : existingLike._id},{session});
            await InteractionCount.updateOne({targetId,targetType},{$inc : {likeCount : -1}},{upsert : true,session});
            await OutBox.create([{
                eventId,
                eventType : "like.deleted",
                payload : {
                    likeId : existingLike._id,
                    userId,
                    targetId,
                    targetType
                }
            }],{session});
            await session.commitTransaction();
            session.endSession();
            logger.info("Like removed successfully");
            return res.status(200).json({
                success : true,
                message : "Like removed successfully"
            });
        }
        // Create a new Like
        const newLikeArray = await Like.create([{userId,targetId,targetType}],{session});
        const newLike = newLikeArray[0];  // Extract first element from array

        //update like count in interaction count collection
        await InteractionCount.updateOne({targetId,targetType},{$inc : {likeCount : 1}},{upsert : true,session});

        await OutBox.create([{
            eventId ,
            eventType : "like.created",
            payload : {
                likeId : newLike._id,
                userId,
                targetId,
                targetType
            }
        }],{session});

        await session.commitTransaction();
        await session.endSession();

        logger.info("Like created successfully");
        res.status(201).json({
            success : true,
            message : "Like created successfully",
            data : newLike
        });
    
    }catch(err){
            await session.abortTransaction();
            await session.endSession();
        logger.error("Error creating like", err);
        res.status(500).json({message : "Internal Server Error"});
    }
}



module.exports = {
    createLike
}

