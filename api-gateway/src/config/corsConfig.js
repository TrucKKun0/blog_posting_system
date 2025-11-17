const cors = require('cors');
const logger = require('../utils/logger');

const configuration = ()=>{
    return cors({
        origin:(origin,callback)=>{
        allowedCors : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002'

        ]
        if(!origin || allowedCors.indexOf(origin)!==-1){
            callback(null,true)
        }
        else{
            logger.error(`cors error ${origin}`)
            callback(new Error('not allowed by cors'))

        }
    },
    allowedHeaders:['Content-Type','Authorization'],
    exposedHeaders:['X-Total-Count','Content-Range'],
    credentials:true,
    preflightContinue:true,
    optionsSuccessStatus:204,
    maxAge:3600
    })
    
}

module.exports = {configuration};