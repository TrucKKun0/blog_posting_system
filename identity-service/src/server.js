
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const configuration = require('./config/corsConfig');
const helmet = require('helmet');
const userRouter = require('./routers/UserRouter');
const errorHandler = require('./middlewares/errorHandler');
const connectToMongoDB = require('./config/mongooseConfig');
const cookieParser = require('cookie-parser');
const requestLogger = require('./middlewares/requestLogger');


const PORT = process.env.PORT || 3000;

connectToMongoDB();

// Middleware
app.use(express.json());
app.use(configuration());
app.use(helmet());
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Routes
app.use('/api/auth', userRouter);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`Identity Service is running on port ${PORT}`);
});
