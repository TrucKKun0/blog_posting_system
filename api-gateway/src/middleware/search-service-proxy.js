const proxyOption =require('./proxyOption');
const proxy = require('express-http-proxy');
const logger = require('../utils/logger');
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL;

const searchServiceProxy = proxy(SEARCH_SERVICE_URL, {
    ...proxyOption,
    timeout: 30000, // 30 second timeout
    proxyReqOptDecorator: (proxyReqOpt, srcReq) => {
        // Forward Authorization header if present
        if (srcReq.headers['authorization']) {
            proxyReqOpt.headers['Authorization'] = srcReq.headers['authorization'];
        }

        // Forward user ID if available (set by optionAuthMiddleware)
        if (srcReq.userId) {
            proxyReqOpt.headers["x-user-id"] = srcReq.userId;
        }

        return proxyReqOpt;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        // Log proxy response
        logger.info(`Proxied to identity service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }
});

module.exports = { searchServiceProxy };