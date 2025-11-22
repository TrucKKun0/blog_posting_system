require(dotenv).config();
const logger = require('../utils/logger');
const cors = require('cors');

const configuration = ()=>{
    return cors ({
        origin:(origin,callback)=>{
            allowedCors = [
                'http://localhost:3000', // API Gateway
                'http://localhost:3001', // Identity Service
                'http://localhost:3002', // Profile Service
                'http://localhost:3003',  // Media Service 
                'http://localhost:3004' // POST Service
            ]
            if(!origin || allowedCors.indexOf(origin) !== -1){
                callback(null,true);
            }else{
                logger.error(`CORS error: Origin ${origin} not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders:['Content-Type','Authorization','x-user-id'],
        methods : ["GET","POST","PUT","DELETE","PATCH"],
        preflightContinue : true,
        optionSuccessStatus:204,
        maxAge:3600,
    })
}
module.exports = {configuration};