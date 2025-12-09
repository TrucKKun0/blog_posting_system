require('dotenv').config();
const logger = require('../utils/logger');
const proxy = require('express-http-proxy');
const POST_SERVICE_URL = process.env.POST_SERVICE_URL;
const proxyOption = require('./proxyOption');
const postServiceProxy = proxy(POST_SERVICE_URL,{
    ...proxyOption,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers['Authorization'] = srcReq.headers['authorization'];
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
        proxyReqOpts.headers['Content-Type'] = srcReq.header['content-type'];
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userRes,userReq)=>{
        logger.info(`Proxied to post service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }

});
module.exports = {postServiceProxy}