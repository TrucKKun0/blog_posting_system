const logger=  require("./logger");
const Trending = require("../models/trendingModel");
const InteractionRefrence = require("../models/interactionRefrence");

const calculateTrendingSocre = async (postId)=>{
    try{
        const intreactonData = await InteractionRefrence.findOne({postId});
        const trendingData = await Trending.findOne({postId});

        const likeCount  = intreactonData ? intreactonData.likeCount : 0;
        const commentCount = intreactonData ? intreactonData.commentCount : 0;
        
        const createdAt = trendingData?.createdAt || new Date();
        const hours = (Date.now()-new Date(createdAt).getTime())/(1000*60*60);
        const score = ((likeCount*2 + commentCount*3) / Math.pow((hours+2),1.5));
        await Trending.findOneAndUpdate({
            postId
        },{
            $set : {
                score,
                likeCount,
                commentCount,
                updatedAt : new Date()
            }
        },{
            $setOnInsert : {
                postId,
                createdAt : new Date(),
            }
        },{
            upsert : true,
            new : true
        })
        logger.info(`Calculated trending score for post ${postId} → score: ${score}, likes: ${likeCount}, comments: ${commentCount}`);
    }catch(error){
        logger.error(`Error calculating trending score for post ${postId}: ${error.message}`);
        throw error;
    }
}
module.exports = {calculateTrendingSocre};