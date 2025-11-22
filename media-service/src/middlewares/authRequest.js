const logger = require('../utils/logger');

const authRequest = (req,res,next)=>{
    try{
        const userId = req.headers['x-user-id'];
        if(!userId){
            logger.error(`Request without access token. Please Try again after login `);
            return res.status(401).json({
                success:false,
                message:"Request without access token. Please Try again after login"
            })
        }
        req.user  = userId;
        next();
    }catch(error){
        logger.error(error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {authRequest};