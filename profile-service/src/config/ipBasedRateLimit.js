const rateLiimit = require('express-rate-limit');
const logger = require('../utils/logger');

const ipBasedRateLimiter = (maxRequest , time)=>{
    return rateLiimit({
        max : maxRequest,
        windowMs:time,
        message:"Limit reached for updating your profile. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
        handler:(req,res)=>{
            logger.error(`Too many requests from ${req.ip}`);
            res.status(429).json({
                success:false,
                message:"Limit reached for updating your profile. Please try again later."
            })
        }
    })
}

module.exports = ipBasedRateLimiter;