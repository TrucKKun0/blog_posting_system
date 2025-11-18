const cors = require('cors');
const logger = require('../utils/logger');

const configuration = () => {
    return cors({
        origin: (origin, callback) => {
            // Allow requests from API Gateway and other services
            const allowedCors = [
                'http://localhost:3000', // API Gateway
                'http://localhost:3001', // Identity Service (self)
                'http://localhost:3002'  // Other services
            ];

            if (!origin || allowedCors.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['X-Total-Count', 'Content-Range'],
        credentials: true,
        preflightContinue: true,
        optionsSuccessStatus: 204,
        maxAge: 3600
    });
};

module.exports = configuration;