require('dotenv').config();
const express = require("express");
const { corsConfiguration} = require("./config/corsConfig");
const {connectToMongoDB} = require("./config/mongoConfig");
const router = require("./router/interactionRouter");
const { ipBasedRateLimit} = require("./config/ipBaseRateLimit");
const logger = require("./utils/logger");
const helmet = require("helmet");
const {connectToRabbitMQ} = require("./config/rabbitMqConfig");
const {errorHandler} = require("./utils/errorHandling");
const PORT = process.env.PORT || 3006;
const {requestLogger} = require("./utils/requestLogger");
const {publishOutBoxEvent} = require("./utils/eventWorker");
const {handlePostCreation,handlePostDeletion} = require("./eventHandling/postEventHandeling");
const {consumeEvent} = require("./config/rabbitMqConfig");



async function startServer() {
    try {
        
        const app = express();
        
        app.use(express.json());
        app.use(requestLogger);
        app.use(helmet());
        app.use(corsConfiguration());
        app.use(ipBasedRateLimit(50, 1000 * 60));
        
        app.use("/api/interactions", router);
        app.use(errorHandler);
        await connectToMongoDB();
        await connectToRabbitMQ();
        
        // Register event consumers
        await consumeEvent('post.published', handlePostCreation);
        await consumeEvent('post.deleted', handlePostDeletion);
        logger.info('RabbitMQ event consumers registered');

        app.listen(PORT, () => {
            logger.info(`Interaction Service running on port ${PORT}`);
        });

        if (process.env.NODE_ENV !== "test") {
            let isProcessing = false;

            setInterval(async () => {
                if (isProcessing) return;
                isProcessing = true;

                try {
                    await publishOutBoxEvent();
                } catch (error) {
                    logger.error(error.message);
                } finally {
                    isProcessing = false;
                }
            }, 5000);
        }

    } catch (error) {
        logger.error(`Startup failed: ${error.message}`);
        process.exit(1);
    }
}

startServer();
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});
