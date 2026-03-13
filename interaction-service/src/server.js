const express = require("express");
const {corsConfig} = require("./config/corsConfig");
const {connectDB} = require("./config/dbConfig");
const router = require("./router/interactionRouter");
const {rateLimiter} = require("./middleware/rateLimiter");
const logger = require("./config/loggerConfig");
const helmet = require("helmet");
const {connectToRabbitMQ} = require("./config/rabbitMqConfig");
const {errorHandler} = require("./middleware/errorHandler");
const PORT = process.env.PORT
const {requestLogger} = require("./utils/requestLogger");
const {publishOutBoxEvent} = require("./utils/eventWorker");
connectDB();



const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(corsConfig());
app.use(rateLimiter(50,1000*60));

app.use("/api/interactions",router);
app.use(errorHandler);
function startserver(){
    app.listen(PORT,()=>{
        connectToRabbitMQ();
        logger.info(`Interaction Service is running on port ${PORT}`);
    });
}
startserver();
if (process.env.NODE_ENV !== 'test'){
    setInterval(()=>{
        publishOutBoxEvent().catch((error)=>{
            logger.error(`Error publishing OutBox events: ${error.message}`);
        });
    },5000);
}
process.on('unhandledRejection',(error)=>{
    logger.error(`Unhandled Rejection: ${error.message}`);
    process.exit(1);
});

process.on('uncaughtException',(reason,promise)=>{
    logger.error(`Uncaught Exception: ${reason} at: ${promise}`);
    process.exit(1);
});
