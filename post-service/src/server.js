require('dotenv').config();
const express = require('express');
const {connectToMongoDB} = require('./config/connectToDB');
const {connectToRabbitMQ} = require('./config/rabbitMQConfig');
const postRoutes = require('./routes/postRoutes');
const logger = require('./utils/logger');
const app = express();
const {corsConfiguration} = require('./config/corsConfig');
const {ipBasedRateLimiter} = require('./config/ipBasedRateLimiter');
const PORT = process.env.PORT || 3004;
const {errorHandler} = require('./utils/errorHandler');
const { requestLogger } = require('./utils/requestLogger');

connectToMongoDB();
app.use((req,res,next)=>{
    if(req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')){
        return next();
    }
    express.json()(req,res,next);
})    
app.use(corsConfiguration());
app.use(requestLogger());
app.use(ipBasedRateLimiter(50,15*60*1000)); // 50 requests per 15 minutes
app.use('/api/posts',postRoutes);
app.use(errorHandler);

async function startServer(){
    try{
        await connectToMongoDB();
        await connectToRabbitMQ();
        app.listen(PORT,()=>{
            logger.info(`Post Service is running on port ${PORT}`);
        })
    }catch(error){
        logger.error(`Error while starting server ${error.message}`);
    }
}

startServer();

process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
})