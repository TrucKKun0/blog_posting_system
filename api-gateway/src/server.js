require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const {configuration} = require('./config/corsConfig');
const {ipBasedRateLimiter} = require('./utils/rateLimiter');
const helmet = require('helmet');
const {identityServiceProxy} = require('./middleware/identity-service-proxy');

// Environment validation
const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL;
const PORT = process.env.PORT || 3000;

if (!IDENTITY_SERVICE_URL) {
    logger.error('IDENTITY_SERVICE_URL is not defined in environment variables');
    console.error('ERROR: IDENTITY_SERVICE_URL is required. Please set it in .env file');
    process.exit(1);
}

app.use(express.json());
app.use(configuration());
app.use(ipBasedRateLimiter(50, 1000 * 60 * 60)); // 10 requests per hour
app.use(helmet());

// Global request logging
app.use((req, res, next) => {
    logger.info(`[Gateway] ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Setting up proxy for identity service
app.use('/v1/auth', identityServiceProxy);

app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`Proxying /v1/auth/* to ${IDENTITY_SERVICE_URL}`);
});