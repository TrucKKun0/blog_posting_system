require('dotenv').config();

const express = require('express');
const app = express();
const {configuration}= require('./config/corsConfig')
const logger = require('./utils/logger');
const ipBasedRateLimit = require('./config/ipBasedRateLimit');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(configuration);
app.use(helmet());
app.use(errorHandler);
app.use(ipBasedRateLimit(5,1000*60*60));

app.listen(PORT,()=>{
    logger.info(`Media Service is running on port ${PORT}`);
})

