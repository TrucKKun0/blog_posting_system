const proxyOption = require('./proxyOption');
const proxy = require('express-http-proxy');
const logger = require('../utils/logger');
const INTERACTION_SERVICE_URL = process.env.INTERACTION_SERVICE_URL;

const interactionServiceProxy = proxy(INTERACTION_SERVICE_URL, {
    ...proxyOption,
    timeout: 30000, // 30 second timeout
    proxyReqOptDecorator: (proxyReqOpt, srcReq) => {
        // Forward Authorization header
        if (srcReq.headers['authorization']) {
            proxyReqOpt.headers['Authorization'] = srcReq.headers['authorization'];
        }
        // Add x-user-id from optionAuthMiddleware (sets req.userId)
        if (srcReq.userId) {
            proxyReqOpt.headers['x-user-id'] = srcReq.userId;
        }
        return proxyReqOpt;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        // Log proxy response
        logger.info(`Proxied to interaction service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }
});

module.exports = { interactionServiceProxy };