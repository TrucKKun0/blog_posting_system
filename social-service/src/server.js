const express = require('express');
const logger = require('../utils/logger');
const {ipBasedRateLimiter} = require('./configs/ipBasedRateLimiter');
const {configuration} = require('./configs/corsConfig');
const {connectToMongoDB} = require('./configs/connectTODB');
const {PORT} = process.env || 3005;
const app = express();
const {connectToRabbitMQ} = require('./configs/configRabbitMQ');
const {errorHandler} = require('../utils/errorHandler');
const {requestLogger} = require('./utils/requestLogger');
const helmet = require('helmet');
const followRouter = require('./routers/followRouter');

app.use(helmet());


app.use(requestLogger);

connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(configuration());
app.use(ipBasedRateLimiter(100,1000*60*60));
app.use('/api/follow',followRouter);

app.use(errorHandler);
function startServer (){
    app.listen(PORT,()=>{
        connectToRabbitMQ();
        logger.info(`Social Service is running on port ${PORT}`);
    });
}
startServer();

process.on('unhandledRejection',(error)=>{
    logger.error(`Unhandled Rejection: ${error.message}`);
    process.exit(1);
});

process.on('uncaughtException',(reason,promise)=>{
    logger.error(`Uncaught Exception: ${reason} at: ${promise}`);
    process.exit(1);
});
