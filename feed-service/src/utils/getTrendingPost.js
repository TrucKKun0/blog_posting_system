const logger = require("./logger");
const Trending = require("../models/trendingModel");

const getTrendingPosts = async ()=>{
    
    try{
        const trendingPosts = await Trending.find().sort({score : -1}).limit(limit).skip(skip);
        return trendingPosts;
    } catch (error) {
        logger.error("Error fetching trending posts:", error);
        throw error;
    }
}
module.exports = {getTrendingPosts};