const cors  = require('cors');
const logger = require('../utils/logger');

const configuration = ()=>{
     return cors({
        origin : (origin ,callback)=>{
            const allowedCors = [
                'http://localhost:3000', // API Gateway
                'http://localhost:3001', // Identity Service
                'http://localhost:3002', // Social Service (self)
                'http://localhost:3003', // Media Service
                'http://localhost:3004', // Post Service
            ]
            if(!origin  || !allowedCors.includes(origin) === -1){
                callback(null,true);
            }
            else{
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders : ['Content-Type','Authorization'],
        methods : ['GET','POST'],
        preflightContinue : true,
        optionsSuccessStatus : 204,
        maxAge : 3600
     });
}
module.exports = { configuration };