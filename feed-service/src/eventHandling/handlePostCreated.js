const logger = require("../utils/logger");
const PostReference = require("../models/postReference");
const { handlePostPushToFeed } = require("./handlePostPushToFeed");

const handlePostEvent = async (event)=>{
    try{
        const {eventType, payload} = event;
        const {postId, authorId} = payload;
        logger.info(`Received event: ${eventType} → postId: ${postId}, authorId: ${authorId}`);

        if(eventType === "post.created"){
            await handlePostPushToFeed(event);
            const {content,mediaUrl} = payload;
            await PostReference.findOneAndUpdate({postId, authorId},
                {$setOnInsert : {postId, authorId, content, mediaUrl} },
                {upsert : true, new: true}
            );
            logger.info(`Created post reference: postId: ${postId}, authorId: ${authorId}`);
        }
            else if(eventType === "post.deleted"){
           const result = await PostReference.deleteOne({postId});
           if(result.deletedCount > 0){
            logger.info(`Deleted post reference: postId: ${postId}`);
           } else{
            logger.warn(`Post reference not found for deletion: postId: ${postId}`);
           }
            }
    }catch(error){
        logger.error(`Error handling post event: ${error.message}`);
    }
}

module.exports = {handlePostEvent};
