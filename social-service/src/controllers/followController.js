const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const {publishEvent} = require('../config/connectRabbitMq');
const Follow = require('../models/followModel');
const followUser = async (req,res)=>{
    logger.info('User follow request received');
    try{
        const eventId = uuidv4();
        const followerId = req.user.userId;
        const followingId = req.params.userId;
        //check if user is trying to follow themselves
        if(followerId.toString() === followingId.toString()){
            logger.error(`User ${followerId} cannot follow themselves`);
            return res.status(400).json({
                success:false,
                message:"You cannot follow yourself"
            });
        }
        //create follow relationship
        //setOnInsert insert only once if the document is not found and upsert true creates a new document if no document matches the query

        const newFollow = await Follow.updateOne(
            {followerId,followingId},
            {$setOnInsert : {followerId,followingId} },
            {upsert : true}
        )
        //check if the follow relationship already exists upsertedCount will be 0 if the document already exists
        if (newFollow.upsertedCount === 0){
            logger.error(`User ${followerId} already follows user ${followingId}`);
            return res.status(400).json({
                success:false,
                message:"You already follow this user"
            });
        }
        await publishEvent('user.followed',{
            eventId,
            occurredAt : new Date().now(),
            data : {
                followerId,
                followingId
            }
        })

        logger.info(`User ${followerId} followed user ${followingId}`);
        res.status(200).json({
            success:true,
            message:"User followed successfully"
        });


    }catch(error){
        logger.error(`Error following user: ${error.message}`);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
const unFollowUser = async (req,res)=>{
    logger.info('User unfollow request received');
    try{
        const eventId = uuidv4();
        const followerId = req.user.userId;
        const followingId = req.params.userId;
        //check if user is trying to unfollow themselves
        if(followerId.toString() === followingId.toString()){
            logger.error(`User ${followerId} cannot unfollow themselves`);
            return res.status(400).json({
                success:false,
                message:"You cannot unfollow yourself"
            });
        }
        //check if user has followed the user
        const unfollowRequest = await Follow.findOne({followerId,followingId});
        if(!unfollowRequest){
            logger.error(`User ${followerId} has not followed user ${followingId}`);
            return res.status(400).json({
                success:false,
                message:"You have not followed this user"
            });
        }
        const deleteFollow = await Follow.deleteOne({followerId,followingId});
        await publishEvent('user.unfollowed',{
            eventId,
            occurredAt : new Date.now(),
            data : {
                followerId,
                followingId
            }
        })
        logger.info(`User ${followerId} unfollowed user ${followingId}`);
        res.status(200).json({
            success:true,
            message:"User unfollowed successfully",
            
        });

    }catch (error){
        logger.error(`Error unfollowing user: ${error.message}`);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

module.exports = {
    followUser,
    unFollowUser
}