require(dotenv).config();

const winston = require('winston');

const {createLogger , myFormat, transports} = winston;
const {combine, timestamp, printf} = format;

 myFormat = printf(({level,message,timestamp})=>{
    return `${level} {${timestamp} ${message} }`;
})

const logger = createLogger({
    level : 'info',
    format : combine(timestamp(), myFormat),
    transports:[
        new transports.File({filename:"error.log" , level:"error"}),
        new transports.File({filename:"combine.log"}),
        new transports.File({filename:"info.log", level:"info"}),

    ]
})

if(NODE_ENV === "development"){
    logger.add(new transports.Console());
}

module.exports = logger;