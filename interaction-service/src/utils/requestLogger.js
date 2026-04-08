const logger = require("./logger");

const requestLogger = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    logger.info(`[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
    next();
}
module.exports = {requestLogger};