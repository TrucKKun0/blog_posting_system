const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');

const handlePostCreated = async (event)=>{
   const result = await UserProfile.updateOne({
        userId : event.userId,
        processedEvent : {$ne : event.eventId}
    },
    {
        $addToSet:{
            publishedPost : {
                postId : event.postId,
                title : event.title,
                slug : event.slug,
                publishedAt : event.publishedAt
            },
            processedEvent : event.eventId
        }
    }
    );
    if(result.matchedCount === 0){
        logger.error(`Post publish event ignored (duplicate or profile missing). 
       userId=${event.userId}, eventId=${event.eventId}`);
    }
    if(result.modifiedCount === 1){
        logger.info(`Post publish event processed successfully. 
        userId=${event.userId}, eventId=${event.eventId}`);
    }

}
module.exports = {handlePostCreated};