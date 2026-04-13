const Trending = require('../models/trendingModel');

const logger = require('../utils/logger');

const Feed = require("../models/feedModel");

const { getTrendingPosts } = require('../utils/getTrendingPost');

const { getPersonalizedFeed } = require('../utils/getPersonlizedFeed');



const getFeed = async (req,res)=>{

    try {

        const userId = req.userId;

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        logger.info(`Feed request received - userId: ${userId}, req.user: ${JSON.stringify(req.user)}, headers: ${JSON.stringify(req.headers)}`);

        if(!userId){

            logger.info("Fetching feed for not logged in user");

            const trendingFeed = await getTrendingPosts(limit, skip);

            logger.info(`Returning ${trendingFeed.length} trending posts`);

            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

            res.status(200).json({

                success : true,

                data : trendingFeed

            });

        }else{

            logger.info(`Fetching personalized feed for user ${userId}`);

            const personalizedFeed = await getPersonalizedFeed(userId, limit, skip);

            logger.info(`Returning ${personalizedFeed.length} posts for user ${userId}`);

            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

            res.status(200).json({

                success : true,

                data : personalizedFeed

            });

        }

    } catch (error) {

        logger.error(`Error in getFeed: ${error.message}`);

        logger.error(error.stack);

        res.status(500).json({

            success: false,

            message: 'Failed to fetch feed',

            error: error.message

        });

    }

}



module.exports = {

    getFeed

}