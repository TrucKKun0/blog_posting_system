const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const ipBasedRateLimiter = (maxRequest , time) =>{
    return rateLimit({
        max : maxRequest ,
        windowMs : time,
        message : "Too many requests from this IP. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
        handler : (req,res)=>{
            logger.error(`Too many requests from ${req.ip}`);
            res.status(429).json({
                success:false,
                message:"Too many requests from this IP. Please try again later."
            })
        }
    });
}
module.exports = ipBasedRateLimiter;