require('dotenv').config();
const logger = require('../utils/logger');
const proxy = require('express-http-proxy');
const POST_SERVICE_URL = process.env.POST_SERVICE_URL;
const proxyOption = require('./proxyOption');
const postServiceProxy = proxy(POST_SERVICE_URL,{
    ...proxyOption,
    proxyReqOptDecorator:(proxyOpt,srcReq)=>{
         const authHeader = srcReq.headers['authorization'] || srcReq.headers['Authorization'];
         if(authHeader){
            proxyOpt.headers["Authorization"] = authHeader;
            // Preserve original Content-Type (don't force JSON for file uploads)
            if(srcReq.headers['content-type']){
                proxyOpt.headers["Content-Type"] = srcReq.headers['content-type'];
            }
         }
         // Set x-user-id header if userId is available
         if(srcReq.userId){
            proxyOpt.headers["x-user-id"] = srcReq.userId;
         } else if (srcReq.user && srcReq.user.userId){
            proxyOpt.headers["x-user-id"] = srcReq.user.userId;
         }
        return proxyOpt;
    },
    userResDecorator:(proxyRes,proxyResData,userRes,userReq)=>{
        logger.info(`Proxied to post service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }

});
module.exports = {postServiceProxy}