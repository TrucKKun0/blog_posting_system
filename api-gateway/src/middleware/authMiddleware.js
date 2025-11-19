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
    jwt.verify(token,JWT_SECRET_KEY,(err,user)=>{
        if(err){
            logger.error("Invalid token");
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }
        req.user = user;
        next();
    })
}
module.exports = {validateToken}