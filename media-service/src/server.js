require('dotenv').config();

const express = require('express');
const app = express();
const {configuration}= require('./config/corsConfig')
const logger = require('./utils/logger');
const ipBasedRateLimit = require('./config/ipBasedRateLimit');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const mediaRouter = require('./routes/mediaRouters');
const { connectToDB } = require('./config/connectDB');
const {connectToRabbitMQ,consumeEvent} = require('./config/connectRabbitMq');

const {handleProfileDeleted} = require('./eventHandling/profileMediaHandle');

const PORT = process.env.PORT || 3003;
connectToDB()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(configuration);
app.use(helmet());
app.use(errorHandler);
app.use(ipBasedRateLimit(5,1000*60*60));

app.use('/api/media',mediaRouter);

async function startServer(){
    try{
        await connectToRabbitMQ();
        //cosumeEvent for deleting media
        await consumeEvent('profile.deleted',handleProfileDeleted);
        app.listen(PORT,()=>{
            logger.info(`Media Service is running on port ${PORT}`);
        })

    }catch(error){
        logger.error(`Error while starting server ${error.message}`);
    }
}

startServer();

//unhandled promise rejection
process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
})

