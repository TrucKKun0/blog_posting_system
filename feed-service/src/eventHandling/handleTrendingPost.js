const logger = require('../utils/logger');
const Trending = require('../models/trendingModel');
const handlePostCreatedTrending = async (event) => {
    try {
        const { postId } = event.payload;

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

        logger.info(`Initialized trending for post ${postId}`);

    } catch (error) {
        logger.error(error.message);
    }
};
module.exports = { handlePostCreatedTrending };