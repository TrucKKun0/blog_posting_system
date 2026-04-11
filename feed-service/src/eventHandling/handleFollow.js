const logger = require("../utils/logger");
const SocialRefrence = require("../models/socialReference");

const handleFollowEvent = async(event)=>{
    try{
        const {eventType,data} = event;
        const {followerId , followingId} = data;
        logger.info(`Received event: ${eventType} → followerId: ${followerId}, followingId: ${followingId}`);
        if(eventType === "user.follow"){
            await SocialRefrence.findOneAndUpdate(
                {followerId,followingId},
                {$setOnInsert : {followerId,followingId} },
                {upsert : true, returnDocument : "after"}
            );
            logger.info(`Created follow relationship: ${followerId} → ${followingId}`);
        }else if(eventType === "user.unfollow"){    
            const deleteFollow = await SocialRefrence.deleteOne({followerId,followingId});
            logger.info(`Deleted follow relationship: ${followerId} → ${followingId}`);
        }
        }
    catch(error){
        logger.error(`Error handling follow event: ${error.message}`);
    }
}
module.exports = {handleFollowEvent};