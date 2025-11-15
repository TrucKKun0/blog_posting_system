const rateLimit = require('express-rate-limit');

const ipBasedRateLimiter = (maxRequest , time)=>{
    return rateLimit({
        max: maxRequest, // Limit each IP to send  limited number of requests per windowMs
        windowMs: time, // Set the time windowMs
        message: "Too many requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
        handler:(req,res)=>{
            logger.error(`Too many requests from ${req.ip}`);
            res.status(429).json({
                success:false,
                message:"Too many requests from this IP, please try again later."
            })
        }
    })
}

module.exports = ipBasedRateLimiter;