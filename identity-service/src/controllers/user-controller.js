const User = require('../models/UserModel');

const logger = require('../utils/logger');
const {validateRegisterUser,validateLoginUser} = require('../utils/validator');
const {generateToken} = require('../utils/generateToken');

const registerUser = async(req,res)=>{
    try{
        logger.info("Register user endpoint hit");
        const {error} = validateRegisterUser(req.body);
        if(error){
            logger.error("Validation Error while registering user",error.details[0].message);
            return res.status(400).json({
                success:false,
                message:"Validation Error while registering user",
                error:error.details[0].message
            })
        }
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            logger.error(`User already exists with${email}`);
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        //Creating new User
        const user = new User({
            username,
            email,
            password
        })
        await user.save();
        logger.info("User registered successfully",user._id);
        const {accessToken,refreshToken} = await generateToken(user);
        res.status(201).json({
            success:true,
            AccessToken:accessToken,
            RefreshToken:refreshToken,
            message:"User registered successfully"
        })
    }catch(error){
        logger.error("Error while registering user",error.message);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    registerUser
}