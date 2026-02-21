const logger = require("../utils/logger");
const PostRefrence = require("../models/postRefrenceModel");
const Comment = require("../models/commentModel");
const {validateComment} = require("../utils/validateComment");
const InteractionCount = require("../models/interactionCountModel");
const OutBox = require("../models/OutBoxModel");
const { v4: uuidv4 } = require('uuid');
const postComment = async(req,res)=>{
    try{
        const {postId} = req.params;
        //Check whether post exits or not 
        const foundPost = await PostRefrence.findOne({postId});
        if(!foundPost){
            logger.error(`Post not found with postid ${postId}`);
            return res.status(401).json({ 
                success : "false",
                message : "Post not found"
            });
        }

        const {userId} = req.user;
        const {error} = validateComment(req.body);
        if(error){
            logger.error(`Validation Error while posting comment ${error.details[0].message}`);
            return res.status(400).json({
                success : "false",
                message : "Validation Error while posting comment",
                error : error.details[0].message
            });
        }
        const eventId = uuidv4();
        const targetId = postId;
        const {targetType, content} = req.body;

        const newComment = await Comment.create({
            userId,
            targetId,
            targetType,
            content
        });
        await InteractionCount.updateOne(
            {targetId, targetType},
            {$inc : {commentCount : 1}},
            {upsert : true}
        );
        await OutBox.create({
            eventId,
            eventType : 'comment.created',
            payload : {
                commentId : newComment._id,
                userId,
                targetId,
                targetType,
                content
            }
        });
        logger.info(`Comment created successfully ${newComment._id}`);
        res.status(200).json({
            success : true,
            message : "Comment created successfully",
            data : newComment
        });




    }catch(error){
        logger.error("Error while posting comment".error.details[0]);
        return res.status(401).json({
            success : "false",
            message : "Error while posting comment"
        })
    }
}

module.exports = {postComment}