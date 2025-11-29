const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const method = req.method;
        const originalUrl = req.originalUrl;
        const userAgent = req.headers['user-agent'];
        const ip = req.ip || req.connection.remoteAddress;
        const statusCode = res.statusCode;
        const responseTime = Date.now() - start;

        logger.info(
            `[Identity Service] ${method} ${originalUrl} | Status: ${statusCode} | IP: ${ip} | User-Agent: ${userAgent} | ${responseTime}ms`
        );
    });

    next();
};

module.exports = requestLogger;