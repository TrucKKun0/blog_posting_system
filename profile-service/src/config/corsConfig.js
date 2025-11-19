const cors = require('cors');
const logger = require('../utils/logger');

const configuration = ()=>{
    return cors({
        origin:(origin,callback)=>{
            allowedCors = [
                'http://localhost:3000', // API Gateway
                'http://localhost:3001', // Identity Service
                'http://localhost:3002', // Profile Service (self)
                
            ]
            if(!origin || allowedCors.indexOf(origin) !== -1){
                callback(null,true);
            }else{
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders:['Content-Type','Authorization'],
        methods : ["GET","POST"],
        preflightContinue : true,
        optionsSuccessStatus : 204,
        maxAge : 3600
    })
}

module.exports = {configuration};