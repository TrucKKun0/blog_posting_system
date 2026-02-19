const logger = require("./logger");

const requestLogger = (req,next)=>{
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    logger.info(`Method: ${method} URL: ${url} User-Agent: ${userAgent} IP: ${ip}`);
    next();
}
module.exports = {requestLogger};