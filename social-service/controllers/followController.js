const logger = require('../utils/logger');
const Follow = require('../models/followModel');
const followUser = async (req,res)=>{
    logger.info('User follow request received');
    try{
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

module.exports = {
    followUser
}