const proxyOption = require('./proxyOption');
const proxy = require('express-http-proxy');
const logger = require('../utils/logger');
const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL;

const identityServiceProxy = proxy(IDENTITY_SERVICE_URL, {
    ...proxyOption,
    timeout: 30000, // 30 second timeout
    proxyReqOptDecorator: (proxyReqOpt, srcReq) => {
        // Forward Authorization header if present
        if (srcReq.headers['authorization']) {
            proxyReqOpt.headers['Authorization'] = srcReq.headers['authorization'];
        }
        // Forward Content-Type header
        if (srcReq.headers['content-type']) {
            proxyReqOpt.headers['Content-Type'] = srcReq.headers['content-type'];
        }
        return proxyReqOpt;
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
        // Forward the body as-is
        return bodyContent;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        // Log proxy response
        logger.info(`Proxied to identity service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }
});

module.exports = { identityServiceProxy };