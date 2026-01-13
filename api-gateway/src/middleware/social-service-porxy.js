const proxyOption= require('../utils/proxyOption');
const proxy = require('express-http-proxy');
const logger = require('../utils/logger');
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL;

const socialServiceProxy = proxy(SOCIAL_SERVICE_URL,{
    ...proxyOption,
    timeout: 30000, // 30 second timeout
    proxyReqOptDecorator: (proxyReqOpt,srcReq)=>{
        if(srcReq.headers['authorization']){
            proxyReqOpt.headers['Authorization']= srcReq.headers['authorization'];
            proxyReqOpt.headers['x-user-id']=srcReq.user.userId;
        }
        return proxyReqOpt;
    },
    userResDecorator : (proxyRes,proxyResData,userReq,userRes)=>{
        logger.info(`Proxied to social service: ${userReq.method} ${userReq.url} - Status: ${proxyRes.statusCode}`);
        return proxyResData;
    }

});

module.exports = {socialServiceProxy}