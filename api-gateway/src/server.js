const express = require('express');
const app = express();
const logger = require('./utils/logger');
const {configuration} = require('./config/corsConfig');
const {ipBasedRateLimiter} = require('./utils/rateLimiter');
const helmet = require('helmet');

app.use(express.json());
app.use(configuration());
app.use(ipBasedRateLimiter(10,1000*60*60));
app.use(helmet());
app.use((req,res,next)=>{
    logger.info(`Request received from ${req.ip} to ${req.url} with method ${req.method} browser ${req.headers['user-agent']}`);
    next();
})



app.listen(3000,()=>{
    console.log("Api Gateway is running in port 3000");
})