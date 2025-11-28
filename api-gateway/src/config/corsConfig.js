const cors = require('cors');
const logger = require('../utils/logger');

const configuration = () => {
    return cors({
        origin: (origin, callback) => {
            // Allow requests from frontend applications
            const allowedCors = [
                'http://localhost:3000', // API Gateway (self)
                'http://localhost:3001', // Identity Service
                'http://localhost:3002', // Other services
                'http://localhost:3003'  // Frontend Application
                
            ];

            if (!origin || allowedCors.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization','x-user-id'],
        exposedHeaders: ['X-Total-Count', 'Content-Range'],
        credentials: true,
        preflightContinue: true,
        optionsSuccessStatus: 204,
        maxAge: 3600
    });
};

module.exports = { configuration };