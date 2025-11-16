const User = require('../models/UserModel');

const logger = require('../utils/logger');
const {validateRegisterUser,validateLoginUser,validateForgetPassword} = require('../utils/validator');
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
const loginUser = async(req,res)=>{
    logger.info("Login user endpoint hit");
    try{
        const {error} = validateLoginUser(req.body);
        if(error){
            logger.error("Validation Error while logging in user",error.details[0].message);
            return res.status(400).json({
                success:false,
                message:"Validation Error while logging in user",
                error:error.details[0].message
            })
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            logger.error(`User not found with${email}`);
            return res.status(400).json({
                success:false,
                message:`User not found with${email}`
            })
        }
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            logger.error("Invalid password");
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }
        const {accessToken,refreshToken} = await generateToken(user);
        res.status(200).json({
            success:true,
            AccessToken:accessToken,
            RefreshToken:refreshToken,
            message:"User logged in successfully"
        })

    }catch(error){
        logger.error("Error while logging in user",error.message);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const forgetPassword = async(req,res)=>{
    logger.info("Forget password endpoint hit");
    try{
        const {error} = validateForgetPassword(req.body);
        if(error){
            logger.error("Validation Error while forgeting password",error.details[0].message);
            return res.status(400).json({
                success:false,
                message:"Validation Error while forgeting password",
                error:error.details[0].message
            })
        }
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            logger.error(`User not found with${email}`);
            return res.status(400).json({
                success:false,
                message:`User not found with${email}`
            })
        }
        const {newPassword} = req.body;
        await user.changePassword(newPassword);
        res.status(200).json({
            success:true,
            message:`Password changed successfully${user._id}`
        })
    }catch(error){
        logger.info(`Error occured while changing password ${error.message}`)
        res.status(501).json({
            status: false,
            message: `Error occured while changing password ${error.message}`
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgetPassword
}