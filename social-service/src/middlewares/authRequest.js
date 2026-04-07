const logger = require('../utils/logger');

const authRequest =  (req, res, next) =>{
    const userId = req.headers['x-user-id'];
    if(!userId){
        logger.error(`Request without x-user-id header. Please Try again after login `);
        return res.status(401).json({
            success:false,
            message:"Request without access token. Please Try again after login"
        });
    }
    req.user = {userId};  // ✅ Set as object with userId property
    next();
}

module.exports = {authRequest};