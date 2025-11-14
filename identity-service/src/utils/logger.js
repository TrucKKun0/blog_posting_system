
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${timestamp}  ${message}`;
});

const logger = ()=>{
    return createLogger({
        level:"info",
        format : combine(
            timestamp(),
            myFormat()
        ),
        transports:[
            new transports.File({filename:"error.log", level:"error"}),
            new transports.File({filename:"combined.log"}),
            new transports.File({filename:"info.log", level:"info"})
        ]
    })
}
if (process.env.NODE_ENV !== 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
module.exports = logger;