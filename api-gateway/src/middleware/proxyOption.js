const logger = require('../utils/logger');
const proxy = require('express-http-proxy');
//redirecting originating from /v1 to /api
const proxyOption = {
    proxyReqPathResolver: (req)=>{
        return req.originalUrl.replace(/^\/v1/,"/api");
    },
    proxyErrorHandler: (err, res, next)=>{
        logger.error("Proxy Error:",err.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = proxyOption;