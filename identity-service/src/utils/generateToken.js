require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshModel');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = async(user)=>{
    //generate Access Token
    const accessToken = jwt.sign({
        userId : user._id,
        email : user.email
    },JWT_SECRET_KEY,{expriresIn : '1h'});
    //generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt  = new Date();
    expiresAt.setHours(expiresAt.getHours() + 7); // refresh token expires in 7 days 

    await RefreshToken.create({
        token : refreshToken,
        userId : user._id,
        expiresAt : expiresAt
    })
    return {accessToken,refreshToken};
}

module.exports = generateToken;