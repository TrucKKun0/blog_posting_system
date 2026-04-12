const logger = require('../utils/logger');
const Feed = require("../models/feedModel");
const PostReferenceModel = require("../models/postReference");
const getPersonalizedFeed = async (userId, limit, skip) => {
    try {
        const personalizedFeed = await Feed.find({ userId })
            .sort({ score: -1 })
            .limit(limit)
            .skip(skip);

        const trendingPosts = await PostReferenceModel.find()
            .sort({ score: -1 })
            .limit(limit);
            

        if (!personalizedFeed || personalizedFeed.length === 0) {
            logger.info(`No personalized feed for user ${userId}, returning trending`);
            // Transform trending posts to include author object with username
            const trendingWithAuthors = trendingPosts.map(post => ({
                ...post.toObject(),
                authorId: {
                    _id: post.authorId,
                    username: post.authorName || 'Unknown'
                }
            }));

            return trendingWithAuthors;
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

        const finalResult = result.slice(0, limit);

        // Transform all posts to include author object with username
        const resultWithAuthors = finalResult.map(post => ({
            ...post.toObject(),
            authorId: {
                _id: post.authorId,
                username: post.authorName || 'Unknown'
            }
        }));

        logger.info(`Returning ${resultWithAuthors.length} posts for user ${userId} with author details`);
        return resultWithAuthors;

    } catch (error) {
        logger.error(`Error fetching personalized feed: ${error.message}`);
        throw error;
    }
};

module.exports = { getPersonalizedFeed };