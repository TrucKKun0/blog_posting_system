const winston = require('winston');
const {createLogger , transports , format }= winston ;
const {combine , timestamp , printf}  = format ;

const myFormat = printf(({level , message , timestamp})=>{
    return `${timestamp} ${level} : ${message}`;
});

const logger = createLogger ({
    level : 'info',
    format :  combine(timestamp(), myFormat),
    transports : [
        new transports.File({filename : "error.log" , level : "error"}),
        new transports.File({filename : "combined.log"}),
        new transports.File({filename : "info.log" , level : "info"})
    ]
});

if (process.env.NODE_ENV === "development "){
    logger.add (new transports.Console ());
}

module.exports = logger;