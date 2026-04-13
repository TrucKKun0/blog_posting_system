const logger = require('../utils/logger');
const Feed = require("../models/feedModel");
const PostReferenceModel = require("../models/postReference");
const UserLikeReference = require("../models/userLikeReference");
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
            // Fetch user's liked posts
            const likedPosts = userId ? await UserLikeReference.find({ userId, targetType: 'post' }) : [];
            const likedPostIds = new Set(likedPosts.map(like => like.targetId.toString()));
            logger.info(`User ${userId} has liked ${likedPostIds.size} posts: ${Array.from(likedPostIds).slice(0, 5)}`);
            
            // Transform trending posts to include author object with username and like status
            const trendingWithAuthors = trendingPosts.map(post => {
                const postId = post.postId?.toString() || post._id?.toString();
                const isLiked = likedPostIds.has(postId);
                return {
                    ...post.toObject(),
                    authorId: {
                        _id: post.authorId,
                        username: post.authorName || 'Unknown',
                        avatarUrl: post.authorAvatarUrl || null
                    },
                    isLiked
                };
            });

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

        // Fetch user's liked posts
        const likedPosts = userId ? await UserLikeReference.find({ userId, targetType: 'post' }) : [];
        const likedPostIds = new Set(likedPosts.map(like => like.targetId.toString()));
        logger.info(`User ${userId} has liked ${likedPostIds.size} posts: ${Array.from(likedPostIds).slice(0, 5)}`);

        // Transform all posts to include author object with username and like status
        const resultWithAuthors = finalResult.map(post => {
            const postId = post.postId?.toString() || post._id?.toString();
            const isLiked = likedPostIds.has(postId);
            logger.info(`Post ${postId} isLiked: ${isLiked}`);
            return {
                ...post.toObject(),
                authorId: {
                    _id: post.authorId,
                    username: post.authorName || 'Unknown',
                    avatarUrl: post.authorAvatarUrl || null
                },
                isLiked
            };
        });

        logger.info(`Returning ${resultWithAuthors.length} posts for user ${userId} with author details and like status`);
        return resultWithAuthors;

    } catch (error) {
        logger.error(`Error fetching personalized feed: ${error.message}`);
        throw error;
    }
};

module.exports = { getPersonalizedFeed };