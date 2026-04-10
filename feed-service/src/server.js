
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const configuration = require('./config/corsConfig');
const helmet = require('helmet');
const router = require('./router/feedRouter');
const errorHandler = require('./middlewares/errorHandler');
const connectToMongoDB = require('./config/mongooseConfig');
const cookieParser = require('cookie-parser');
const requestLogger = require('./middlewares/requestLogger');
const ipBasedRateLimiter = require('./utils/rateLimiter');
const {connectToRabbitMQ,consumeEvent} = require('./config/rabbitmqConfig');
const {handlePostEvent} = require("./eventHandling/handlePostCreated");
const {handleCommentEvent,handleLikeEvent} = require("./eventHandling/handleInteraction");
const {handleFollowEvent} = require("./eventHandling/handleFollow");
const PORT = process.env.PORT || 3000;

connectToMongoDB();

// Middleware
app.use(express.json());
app.use(configuration());
app.use(helmet());
app.use(cookieParser());
app.use(ipBasedRateLimiter(100, 15 * 60 * 1000));
// Request logging
app.use(requestLogger);

// Routes
app.use('/api/feed', router);

app.use(errorHandler);

// Start server
async function startServer(){
    try{
        await connectToRabbitMQ();
        await consumeEvent("post.published",handlePostEvent);
        await consumeEvent("post.deleted",handlePostEvent);
        await consumeEvent("like.created",handleLikeEvent);
        await consumeEvent("like.deleted",handleLikeEvent);
        await consumeEvent("comment.created",handleCommentEvent);
        await consumeEvent("comment.deleted",handleCommentEvent);
        await consumeEvent("comment.reply",handleCommentEvent);
        await consumeEvent("user.follow",handleFollowEvent);
        await consumeEvent("user.unfollow",handleFollowEvent);

        app.listen(PORT,()=>{
            logger.info(`Feed Service is running on port ${PORT}`);
        })
    }catch(error){
        logger.error(`Error while starting server ${error.message}`);
    }
}
startServer();

process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
})