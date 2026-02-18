const logger = require("../utils/logger");
const RateLimit = require("express-rate-limit");

const ipBasedRateLimit = (maxAge, time)=>{
    return RateLimit({
        max : maxAge,
        window  : time,
        message : "Too many requests from this IP. Please try again later.",
        standardHeaders : true,
        legacyHeaders : false,
        handler : (req,res)=>{
            logger.error(`Too many requests from ${req.ip}`);
            res.status(429).json({
                success : false,
                message : "Too many requests from this IP. Please try again later."
            })
        }
    })
}
module.exports = {ipBasedRateLimit};