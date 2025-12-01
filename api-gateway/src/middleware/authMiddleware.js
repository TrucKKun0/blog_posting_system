const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const validateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        logger.error("Attempt to access without token");
        return res.status(401).json({
            success:false,
            message:"Attempt to access without token"
        })
    }
    try {
        // Use synchronous verify instead of callback
        const user = jwt.verify(token, JWT_SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Invalid token: ${error.message}`);
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
}
module.exports = {validateToken}