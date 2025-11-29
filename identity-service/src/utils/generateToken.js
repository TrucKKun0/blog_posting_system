require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshModel');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = async(user)=>{
    //generate Access Token
    const accessToken = jwt.sign({
        userId : user._id
    },JWT_SECRET_KEY,{expiresIn : '15m'});
    //generate Refresh Token
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt  = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days 

    await RefreshToken.create({
        token : hashedRefreshToken,
        userId : user._id,
        expiresAt : expiresAt
    })
    return {accessToken,hashedRefreshToken};
}

module.exports = {generateToken};