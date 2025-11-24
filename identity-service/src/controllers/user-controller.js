const User = require('../models/UserModel');
const RefreshToken = require('../models/RefreshModel');
const logger = require('../utils/logger');
const {validateUserRegistration, validateUserLogin, validateForgetPassword} = require('../utils/validator');
const {generateToken} = require('../utils/generateToken');

const registerUser = async(req,res)=>{
    try{
        logger.info("Register user endpoint hit");
        const {error} = await validateUserRegistration(req.body);
        if(error){
            logger.error("Validation Error while registering user",error.details[0].message);
            return res.status(400).json({
                success:false,
                message:"Validation Error while registering user",
                error:error.details[0].message
            })
        }
        const {username,email,password} = req.body;
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({email: normalizedEmail});

        if(existingUser){
            logger.error(`User already exists with ${email}`);
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        //Creating new User
        const user = new User({
            username,
            email: normalizedEmail,
            password
        })
        await user.save();
        logger.info(`User registered successfully ${user._id}`);
        const {accessToken,hashedRefreshToken} = await generateToken(user);
        res.cookie('refreshToken',hashedRefreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.status(201).json({
            success:true,
            AccessToken:accessToken,
            RefreshToken:hashedRefreshToken,
            message:"User registered successfully"
        })
    }catch(error){
        logger.error(`Error while registering user ${error.message}`);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const loginUser = async(req,res)=>{
    logger.info("Login user endpoint hit");
    try{
        const {error} = await validateUserLogin(req.body);
        if(error){
            logger.error("Validation Error while logging in user",error.details[0].message);
            return res.status(400).json({
                success:false,
                message:"Validation Error while logging in user",
                error:error.details[0].message
            })
        }
        const {email,password} = req.body;
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            logger.error(`User not found with ${email}`);
            return res.status(400).json({
                success:false,
                message:`User not found with ${email}`
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
        const {accessToken,hashedRefreshToken} = await generateToken(user);
        res.cookie('refreshToken',hashedRefreshToken,{
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 *1000 // 7 days
        })
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
        const {error} = await validateForgetPassword(req.body);
        if(error){
            logger.error(`Validation Error while forgeting password ${error.details[0].message}`);
            return res.status(400).json({
                success:false,
                message:"Validation Error while forgeting password",
                error:error.details[0].message
            })
        }
        const {email} = req.body;
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            logger.error(`User not found with ${email}`);
            return res.status(400).json({
                success:false,
                message:`User not found with ${email}`
            })
        }
        const {newPassword} = req.body;
        await user.changePassword(newPassword);
        res.status(200).json({
            success:true,
            message:`Password changed successfully ${user._id}`
        })
    }catch(error){
        logger.info(`Error occured while changing password ${error.message}`)
        res.status(501).json({
            status: false,
            message: `Error occured while changing password ${error.message}`
        })
    }
}
const generateNewAccessToken = async (req,res)=>{
    logger.info("Generate new access token endpoint hit");
    try{
        const refreshToken = req.cookie.refreshToken;
        if(!refreshToken){
            logger.erro(`Refresh token not provided. Please Login again`);
            return res.status(401).json({
                success:false,
                message:"Refresh token not provided. Please Login again"
            })
        }
        const hashedRefreshToken = crypto.Hash('sha256').update(refreshToken).digest('hex');

        const storedRefreshToken = await RefreshToken.findOne({token:hashedRefreshToken});
        if(!storedRefreshToken){
            logger.error(`Refresh token not found. Please Login again`);
            return res.status(401).json({
                success:false,
                message:"Refresh token not found. Please Login again"
            })
        }
        if(storedRefreshToken.expiresAt < Date.now()){
            logger.error(`Refresh token expired. Please Login again`);
            return res.status(401).json({
                success:false,
                message:"Refresh token expired. Please Login again"
            })
        }

        const newAccessToken = jwt.sign({
            userId : storedRefreshToken.userId
        },JWT_SECRET_KEY,{expiresIn : '15m'});
        res.status(200).json({
            success:true,
            AccessToken:newAccessToken,
            message:"New access token generated successfully"
        })


    }catch(error){
        logger.error(`Error while generating new access token ${error.message}`);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgetPassword
}