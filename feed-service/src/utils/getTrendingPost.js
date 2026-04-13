const logger = require('../utils/logger');

const PostReferenceModel = require('../models/postReference');

const UserLikeReference = require('../models/userLikeReference');



const getTrendingPosts = async (limit, skip, userId = null) => {

    try {

        const trendingPosts = await PostReferenceModel.find()

            .sort({ score: -1, createdAt: -1 })

            .limit(limit)

            .skip(skip);



        // Fetch user's liked posts if userId is provided

        const likedPosts = userId ? await UserLikeReference.find({ userId, targetType: 'post' }) : [];

        const likedPostIds = new Set(likedPosts.map(like => like.targetId.toString()));



        const postsWithAuthors = trendingPosts.map(post => ({

            ...post.toObject(),

            authorId: {

                _id: post.authorId,

                username: post.authorName || 'Unknown',

                avatarUrl: post.authorAvatarUrl || null

            },

            isLiked: likedPostIds.has(post.postId?.toString() || post._id?.toString())

        }));



        logger.info(`Fetched ${postsWithAuthors.length} trending posts with author details and like status`);

        return postsWithAuthors;

    } catch (error) {

        logger.error(`Error fetching trending posts: ${error.message}`);

        throw error;

    }

}



module.exports = { getTrendingPosts };