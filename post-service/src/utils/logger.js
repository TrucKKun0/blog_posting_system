const winston = require('winston');

const {transports, format} = winston;
const {combine,timestamp,printf} = format;

const myFormat = printf(({level,message,timestamp})=>{
    return `[${level}] ${timestamp} : ${message}`;
});

const logger = winston.createLogger({
    level:'info',
    format: combine(
        timestamp(),
        myFormat()
    ),
    transports:[
        new transports.File({filename:'error.log',level:'error'}),
        new transports.File({filename:'combined.log'}),
        new transports.File({filename:'info.log',level:'info'}),
    ]
})

if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({
        format:format.simple(),
    }))
}

module.exports = logger;