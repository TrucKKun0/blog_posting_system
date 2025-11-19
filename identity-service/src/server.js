
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const configuration = require('./config/corsConfig');
const helmet = require('helmet');
const userRouter = require('./routers/UserRouter');
const errorHandler = require('./middlewares/errorHandler');
const connectToMongoDB = require('./config/mongooseConfig');


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToMongoDB();

// Middleware
app.use(express.json());
app.use(configuration());
app.use(helmet());

// Request logging
app.use((req, res, next) => {
    logger.info(`[Identity Service] ${req.method} ${req.url} from ${req.get['User-Agent']} ${req.ip}`);
    next();
});

// Routes
app.use('/api/auth', userRouter);

// Error handler (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`Identity Service is running on port ${PORT}`);
});
