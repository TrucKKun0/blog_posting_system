const logger = require('../utils/logger');
const Feed = require("../models/feedModel");
const Trending = require("../models/trendingModel");

const getPersonalizedFeed = async (userId, limit, skip) => {
    try {
        const personalizedFeed = await Feed.find({ userId })
            .sort({ score: -1 })
            .limit(limit)
            .skip(skip);

        const trendingPosts = await Trending.find()
            .sort({ score: -1 })
            .limit(limit);
            

        if (!personalizedFeed || personalizedFeed.length === 0) {
            logger.info(`No personalized feed for user ${userId}, returning trending`);
            return trendingPosts;
        }

        const personalizedIds = new Set(
            personalizedFeed.map(p => p.postId.toString())
        );

        const filteredTrending = trendingPosts.filter(
            t => !personalizedIds.has(t.postId.toString())
        );

        const result = [];
        let tIndex = 0;
        const interval = 4; 

        for (let i = 0; i < personalizedFeed.length; i++) {
            result.push(personalizedFeed[i]);

            if ((i + 1) % interval === 0 && tIndex < filteredTrending.length) {
                result.push(filteredTrending[tIndex]);
                tIndex++;
            }
        }

        
        while (tIndex < filteredTrending.length && result.length < limit) {
            result.push(filteredTrending[tIndex]);
            tIndex++;
        }

        return result.slice(0, limit);

    } catch (error) {
        logger.error(`Error fetching personalized feed: ${error.message}`);
        throw error;
    }
};

module.exports = { getPersonalizedFeed };