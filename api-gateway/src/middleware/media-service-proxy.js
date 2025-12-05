require('dotenv').config();
const logger = require('../utils/logger');
const proxy = require('express-http-proxy');
const proxyOption = require('./proxyOption');
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

const mediaServiceProxy = proxy(MEDIA_SERVICE_URL,{
    ...proxyOption,
    proxyReqOptDecorator:(proxyReqOpt,srcReq)=>{
        // Forward Authorization header if present
        if(srcReq.headers['authorization']){
            proxyReqOpt.headers['Authorization']=srcReq.headers['authorization'];
            proxyReqOpt.headers['Content-Type']=srcReq.headers['content-type'];
            proxyReqOpt.headers['x-user-id'] = srcReq.user.userId;
        }
        return proxyReqOpt;
    },
    userResDecorator:(proxyRes,proxyResData,userRes,userReq)=>{
        // Log proxy response
        logger.info(`Proxied to media service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }
});

module.exports = {mediaServiceProxy}