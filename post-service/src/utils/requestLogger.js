const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const useragent = req.get('user-agent'); 
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();

    logger.info(`[${timestamp}] ${method} ${url} - User-Agent: ${useragent}`);

    next();
};

module.exports = {requestLogger};