const logger = require('../utils/logger');
const Trending = require('../models/trendingModel');
const handlePostCreatedTrending = async (event) => {
    try {
        const { postId } = event;
        if (!postId) {
            logger.warn('Post ID is missing in the event data');
            return;
        }
        if(event.eventType === 'post.published'){
        await Trending.findOneAndUpdate(
            { postId },
            {
                $setOnInsert: {
                    postId,
                    likeCount: 0,
                    commentCount: 0,
                    score: 0,
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
    }
    else if(event.eventType === 'post.deleted'){
        await Trending.deleteOne({ postId });
        logger.info(`Deleted trending data for post ${postId}`);
        return;
    }else{
        logger.warn(`Unhandled event type: ${event.eventType} for post ${postId}`);
        return;
    }

        logger.info(`Initialized trending for post ${postId}`);

    } catch (error) {
        logger.error(error.message);
    }
};
module.exports = { handlePostCreatedTrending };