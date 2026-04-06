const logger = require('../utils/logger');

const optionAuthMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if(userId){
        req.userId = userId;
    }
    next();
}
module.exports = { optionAuthMiddleware };