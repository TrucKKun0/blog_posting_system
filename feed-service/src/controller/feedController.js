const Trending = require('../models/trendingModel');
const logger = require('../utils/logger');
const Feed = require("../models/feedModel");
const { getTrendingPosts } = require('../utils/getTrendingPost');
const { getPersonalizedFeed } = require('../utils/getPersonlizedFeed');

const getFeed = async (req,res)=>{
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    if(!userId){
        logger.info("Fetching feed for not logged in user");
       const  trendingFeed = await getTrendingPosts(limit, skip);
       res.status(200).json({
        success : true,
        data : trendingFeed
       })
        
    }else{
        logger.info(`Fetching feed for user ${userId}`);
        const personalizedFeed = await getPersonalizedFeed(userId, limit, skip);
        res.status(200).json({
            success : true,
            data : personalizedFeed
        })
    }
    
}

module.exports = {
    getFeed
}