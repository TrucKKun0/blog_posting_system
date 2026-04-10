const logger = require("./logger");
const Trending = require("../models/trendingModel");

const getTrendingPosts = async (limit, skip)=>{
    
    try{
        const trendingPosts = await Trending.find().sort({score : -1}).limit(limit).skip(skip);
        if(trendingPosts.length === 0){
            logger.info("No trending posts found.");
        }
        return trendingPosts;
    } catch (error) {
        logger.error("Error fetching trending posts:", error);
        throw error;
    }
}
module.exports = {getTrendingPosts};