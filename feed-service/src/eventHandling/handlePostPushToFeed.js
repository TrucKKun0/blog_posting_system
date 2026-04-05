const logger = require('../utils/logger');
const Feed = require("../models/feedModel");
const SocialRefrence = require("../models/socialRefrence");



const handlePostPushToFeed = async (event) => {
    try{
        const{postId ,authorId} = event.payload;
        logger.info(`Pushing post ${postId} by author ${authorId} to followers' feeds`);
        const followers = await SocialRefrence.find({
            followingId : authorId
        }).select("followerId");
        if(followers.length === 0){
            logger.info(`No followers found for author ${authorId}, skipping feed push`);
            return;
        }
        const now = new Date();
        const feedDocs = followers.map(f=>({
            userId : f.followerId,
            postId,
            authorId,
            score : now.getTime(),
            createdAt : now
        }));
        await Feed.insertMany(feedDocs);
        logger.info(`Successfully pushed post ${postId} to ${feedDocs.length} followers' feeds`);

    }catch(error){
        logger.error(`Error handling post push to feed event: ${error.message}`);
    }
}
module.exports = {handlePostPushToFeed};