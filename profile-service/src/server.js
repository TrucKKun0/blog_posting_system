require('dotenv').config();

const express = require('express');
const app = express();
const logger = require('./utils/logger');
const {configuration} = require('./config/corsConfig');
const helmet = require('helmet');
const profileRouter = require('./routers/ProfileRouter');
const errorHandler = require('./middlewares/errorHandler');
const profileRouter = require('./routers/ProfileRouter');
const ipBasedRateLimiter = require('./config/ipBasedRateLimit');


const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(configuration);
app.use(helmet());
app.use(errorHandler());
app.use(ipBasedRateLimiter(50,1000*60*60));

app.use('/api/user',profileRouter);

app.listen(PORT,()=>{
    logger.info(`Profile Service is running on port ${PORT}`);
})

process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
})