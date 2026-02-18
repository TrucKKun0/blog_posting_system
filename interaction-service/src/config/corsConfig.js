const cors = require("cors");

const corsConfiguration = ()=>{
    return cors({
        origin : (erigin , callback)=>{
            const allowedCors = [
                'http://localhost:3000', // API Gateway
                'http://localhost:3001', // Identity Service
                'http://localhost:3002', // Profile Service
                'http://localhost:3003', // Media Service
                'http://localhost:3004', // Post Service
                'http://localhost:3005'  // Social Service
            ]
            if(!orgin || allowedCors.indexOf(origin) ===-1){
                callback(null,true);
            }else{
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders : ['Content-Type','Authorization','x-user-id'],
        methods : ['GET','POST'],
        preflightContinue : true,
        optionsSuccessStatus : 204,
        maxAge : 3600
    })
}

module.exports = {corsConfiguration};