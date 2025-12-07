const logger = require('../utils/logger');

const requestLogger = (req,res,next)=>{
    const userAgent = req.header['user-agent']
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    logger.info(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);
    next();
}
module.exports = {requestLogger};