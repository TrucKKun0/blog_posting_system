const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');
const { validateUpdateProfile } = require('../utils/validator');

const updateProfile = async(req,res)=>{
        logger.info('Update profile endpoint hit');
        try{
            const {userId} = req.user;
            const {error} = await validateUpdateProfile(req.body);
            if(error){
                logger.error(`Validation Error while updating profile ${error.details[0].message}`);
                return res.status(400).json({
                    success:false,
                    message:"Validation Error while updating profile",
                    error:error.details[0].message
                })
            }
            const {bio,avatarId} = req.body;
            const userProfile = await UserProfile.create({
                userId,
                bio,
                avatarId : avatarId || null
            })
            logger.info(`Profile updated successfully ${userProfile.userId}`);
            res.status(200).json({
                success:true,
                message:`Profile updated successfully with userId ${userProfile.userId}`
            })
           

        }catch(error){
            logger.error(`Error while updating profile ${error.message}`);
            res.status(500).json({
                success:false,
                message:"Internal Server Error"
            })
        }
}

module.exports = {updateProfile};