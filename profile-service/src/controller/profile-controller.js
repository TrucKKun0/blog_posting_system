const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');
const { validateUpdateProfile } = require('../utils/validator');
const {publishEvent} = require('../config/connectToRabbitMq');

const updateUserProfile = async(req,res)=>{
        logger.info('Update profile endpoint hit');
        try{

            const {userId} = req.user;
            if(req.body === null || Object.keys(req.body).length ===0){
                logger.error('No data provided for updating profile');
                return  res.status(400).json({
                    success:false,
                    message:"No data provided for updating profile"
                })
            }
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

            const profileToUpdate = await UserProfile.findOne({userId});
            if(!profileToUpdate){
                logger.error(`Profile not found for user ${userId}`);
                return res.status(400).json({
                    success:false,
                    message:`Profile not found for user ${userId}`
                });
            }
            const existingAvatarId = profileToUpdate.avatarId;
            const existingBio = profileToUpdate.bio;

            const userProfile = await UserProfile.findOneAndUpdate(
                {userId},
                {
                bio : bio || existingBio,
                avatarId : avatarId || existingAvatarId
                },{new:true}
            )
            logger.info(`Profile updated successfully ${userProfile.userId}`);
            res.status(200).json({
                success:true,
                message:`Profile updated successfully with userId ${userProfile.userId}`,
                data:userProfile
            })
           

        }catch(error){
            logger.error(`Error while updating profile ${error.message}`);
            res.status(500).json({
                success:false,
                message:"Internal Server Error"
            })
        }
}

const deleteAvater = async(req,res)=>{
    logger.info('Delete avatar endpoint hit');
    try{
        const {userId} = req.user;
        const avaterToDeleteProfile = await UserProfile.findOne({userId});
        if(!avaterToDeleteProfile){
            logger.error(`Profile not found for user ${userId}`);
            return res.status(400).json({
                success:false,
                message:`Profile not found for user ${userId}`
            })
        }
        await publishEvent('profile.deleted',{
            userId : userId,
            publicId : avaterToDeleteProfile.avatarId
        })
        avaterToDeleteProfile.avatarId = null;
        await avaterToDeleteProfile.save();
        logger.info(`Avatar deleted successfully for user ${userId}`);
        res.status(200).json({
            success:true,
            message:`Avatar deleted successfully for user ${userId}`
        })


    }catch(error){
        logger.error(`Error while deleting avatar ${error.message}`);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {updateUserProfile,deleteAvater};