require('dotenv').config();

const express = require('express');
const app = express();
const logger = require('./utils/logger');
const {configuration} = require('./config/corsConfig');
const helmet = require('helmet');
const profileRouter = require('./router/profileRouter');
const errorHandler = require('./middlewares/errorHandlers');
const ipBasedRateLimiter = require('./config/ipBasedRateLimit');
const {connectToDB} = require('./config/connectDB');
const {connectToRabbitMQ,consumeEvent} = require('./config/connectToRabbitMq');

const {handleProfileCreated} = require('./eventHandling/profileCreatedMedia');

const PORT = process.env.PORT || 3002;
connectToDB();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(configuration());
app.use(helmet());
app.use(ipBasedRateLimiter(100,1000*60*60)); // Increased to 100 for testing

app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.ip} ${req.originalUrl}`);
    next();
})

app.use('/api/profile',profileRouter);

async function startServer(){
    await connectToRabbitMQ();
    //consumeEvent for creating profile
    await consumeEvent('profile.created',handleProfileCreated);
    //listening to port
    app.listen(PORT,()=>{
        logger.info(`Profile Service is running on port ${PORT}`);
    })
}
startServer();
app.use(errorHandler);



process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
})