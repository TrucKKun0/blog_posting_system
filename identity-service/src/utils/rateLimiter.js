const rateLimit = require('express-rate-limit');

const ipBasedRateLimiter = (maxRequest , time)=>{
    return ratelimit({
        max: maxRequest, // Limit each IP to send  limited number of requests per windowMs
        windowMs: time, // Set the time windowMs
        message: "Too many requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    })
}

module.exports = ipBasedRateLimiter;