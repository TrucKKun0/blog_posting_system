const logger=  require("./logger");
const PostReferenceModel = require("../models/postReference");
const calculateTrendingSocre = async (postId)=>{
    try{
        const intreactonData = await PostReferenceModel.findOne({postId});
        
        const likeCount  = intreactonData ? intreactonData.likeCount : 0;
        const commentCount = intreactonData ? intreactonData.commentCount : 0;
        
        const createdAt = intreactonData?.createdAt || new Date();
        const hours = (Date.now()-new Date(createdAt).getTime())/(1000*60*60);
        const score = ((likeCount*2 + commentCount*3) / Math.pow((hours+2),1.5));
        await PostReferenceModel.findOneAndUpdate({
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