const logger = require('../utils/logger');

const errorHandler = (err,res,next)=>{
    logger.error(err.stack);
    res.status(500).json({
        success : false,
        message : 'Internal Server Error'
    });
}

module.exports = {errorHandler};