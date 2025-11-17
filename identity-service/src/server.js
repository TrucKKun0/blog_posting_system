
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const configuration = require('./config/corsConfig');
const rateLimiter = require('./utils/rateLimiter');
const helmet = require('helmet');
const userRouter = require('./routers/UserRouter');
const errorHandler = require('./middlewares/errorHandler');
const connectToMongoDB = require('./config/mongooseConfig');


const PORT = process.env.PORT || 3000;
connectToMongoDB();
app.use(express.json());
app.use(configuration());
app.use(rateLimiter(10,1000*60*60));//10 requests per minute
app.use(helmet());
app.use(errorHandler);

app.use((req,res,next)=>{
    logger.info(`Request received from ${req.ip} to ${req.url} with method ${req.method} browser ${req.headers['user-agent']}`);
    next();
})

app.use('api/users',userRouter);

app.listen(PORT,()=>{
    console.log(`Idenitiy Server is running in port ${PORT}`);
    
})
