require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const {configuration} = require('./config/corsConfig');
const {ipBasedRateLimiter} = require('./utils/rateLimiter');
const helmet = require('helmet');
const {identityServiceProxy} = require('./middleware/identity-service-proxy');
const {profileServiceProxy} = require('./middleware/profile-service-proxy');
const {mediaServiceProxy} = require('./middleware/media-service-proxy');
const errorHandler = require('./utils/errorHandler');
const {validateToken} = require('./middleware/authMiddleware');

// Environment validation
const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL;
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL;
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;
const PORT = process.env.PORT || 3000;

if (!IDENTITY_SERVICE_URL || !PROFILE_SERVICE_URL) {
    logger.error('Service_URL is not defined in environment variables');
    console.error('ERROR: SERVICE_URL is required. Please set it in .env file');
    process.exit(1);
}

app.use(express.json());
app.use(configuration());
app.use(ipBasedRateLimiter(50, 1000 * 60 * 60)); // 10 requests per hour
app.use(helmet());
app.use(errorHandler);

// Global request logging
app.use((req, res, next) => {
    logger.info(`[Gateway] ${req.method} ${req.originalUrl} from ${req.get['User-Agent']} ${req.ip}`);
    next();
});

// Setting up proxy for identity service
app.use('/v1/auth', validateToken, identityServiceProxy);
app.use('/v1/profile', validateToken, profileServiceProxy);
app.use('/v1/media', validateToken, mediaServiceProxy);


app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`Identity Service is running on port ${IDENTITY_SERVICE_URL}`);
    logger.info(`Profile Service is running on port ${PROFILE_SERVICE_URL}`);
    logger.info(`Media Service is running on port ${MEDIA_SERVICE_URL}`);
});