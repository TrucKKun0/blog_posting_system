const logger = require('../utils/logger');
const Follow = require('../models/followModel');
const followUser = async (req,res)=>{
    logger.info(`User ${req.user.id} followed user ${req.params.userId}`);
    try{
        const {userId} = req.user;
        const userToFollowId = req.params.userId;

        const isFollowing = await Follow.findOne({userId , followingId : userToFollowId});
        if(isFollowing){
            logger.error(`User ${userId} is already following user ${userToFollowId}`);
            return res.status(400).json({
                success:false,
                message:"You are already following this user"
            });
        };

        const newFollow = await Follow.create({
            userId,
            followingId : userToFollowId,
            followerId : userId
        });
        logger.info(`User ${userId} followed user ${userToFollowId}`);
        res.status(200).json({
            success:true,
            message:"User followed successfully"
        });


    }catch(error){
        logger.error(`Error following user: ${error.message}`);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

module.exports = {
    followUser
}