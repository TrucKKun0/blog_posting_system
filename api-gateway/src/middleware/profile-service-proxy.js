const proxyOption = require('./proxyOption');
const proxy = require('express-http-proxy');
const logger = require('../utils/logger');
const { validateToken}= require('./authMiddleware')

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL;

const profileServiceProxy = proxy(PROFILE_SERVICE_URL,{
    ...proxyOption,
    proxyReqOptDecorator:(proxyOpt,srcReq)=>{
        // Forward Authorization header if present
        if(srcReq.headers['authorization']){
            proxyOpt.headers["Authorization"] = srcReq.headers["authorization"];
            proxyOpt.headers["Content-Type"] = "application/json";
            proxyOpt.headers["x-user-id"] = srcReq.user.userId;
        }
        return proxyOpt;
    },
    userResDecorator:(proxyRes,proxyResData,srcReq,srcRes)=>{
        logger.info(`Proxied to profile service: ${srcReq.method} ${srcReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }

})

module.exports = {profileServiceProxy}