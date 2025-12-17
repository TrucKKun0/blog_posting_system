const logger = require('./logger');
const redis = require('../config/redisConfig');
const invalidateProfileCache = async (req,res,next)=>{
    try{
        const paramUserId = req.params.userId || req.user.userId;
        const cacheKey = `profile:${paramUserId}`;
        await redis.del(cacheKey);
        logger.info(`Cache invalidated for key: ${cacheKey}`);
        next();
    }
    catch(error){
        logger.error(`Error while invalidating cache ${error.message}`);
        next();
    }
}
module.exports = {invalidateProfileCache};