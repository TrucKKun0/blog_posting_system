const logger = require("../utils/logger");
const SocialRefrence = require("../models/socialReference");
const Feed = require("../models/feedModel");
const PostReferenceModel = require("../models/postReference");

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

            // Add existing posts from the followed user to the follower's feed
            const existingPosts = await PostReferenceModel.find({ authorId: followingId });
            if (existingPosts.length > 0) {
                const now = new Date();
                const feedDocs = existingPosts.map(post => ({
                    userId: followerId,
                    postId: post.postId,
                    authorId: post.authorId,
                    score: now.getTime(),
                    createdAt: now
                }));
                await Feed.insertMany(feedDocs);
                logger.info(`Added ${feedDocs.length} existing posts from ${followingId} to ${followerId}'s feed`);
            }
        }else if(eventType === "user.unfollow"){
            const deleteFollow = await SocialRefrence.deleteOne({followerId,followingId});
            logger.info(`Deleted follow relationship: ${followerId} → ${followingId}`);

            // Remove posts from the unfollowed user from the follower's feed
            await Feed.deleteMany({ userId: followerId, authorId: followingId });
            logger.info(`Removed posts from ${followingId} from ${followerId}'s feed`);
        }
        }
    catch(error){
        logger.error(`Error handling follow event: ${error.message}`);
    }
}
module.exports = {handleFollowEvent};