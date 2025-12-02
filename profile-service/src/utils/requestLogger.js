const logger = require('../utils/logger');

const requestLogger = (req,res,next)=>{
    const method = req.method;
    const url = req.originalUrl;
    const useragent = req.get['user-agent'];
    const ip = req.ip;
    logger.info(`Method: ${method} URL: ${url} User-Agent: ${useragent} IP: ${ip}`);
    next();
}
module.exports = requestLogger;