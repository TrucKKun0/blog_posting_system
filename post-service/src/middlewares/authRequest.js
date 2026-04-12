const logger =require('../utils/logger');

const authRequest = (req,res,next)=>{
    const userId = req.headers['x-user-id'] || null;
    req.user = userId ? { userId } : null;
    if(userId ===null){
        logger.info("Unauthenticated request received");
    }else{
        logger.info("Authenticated request received from userId: "+userId);
    }
    next();

}
module.exports = {authRequest};