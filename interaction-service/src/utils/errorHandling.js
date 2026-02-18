const logger = require("./logger");

const errorHandler = (err,req,res,next)=>{
    logger.error(err.stack);
    res.status(500).json({
        success : false,
        message : "Internal Server Error"
    });
    next();
}

module.exports = {errorHandler}