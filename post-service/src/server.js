require('dotenv').config();
const express = require('express');
const {connectToMongoDB} = require('./config/mongoConfig');
const {connectToRabbitMQ} = require('./config/rabbitMQConfig');
const postRoutes = require('./routes/postRoutes');
const logger = require('./utils/logger');
const app = express();
const {corsConfiguration} = require('./config/corsConfig');
const {ipBasedRateLimiter} = require('./middlewares/rateLimiterMiddleware');
const PORT = process.env.PORT || 3004;
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger } = require('./utils/requestLogger');

app.use(express.json());
    
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