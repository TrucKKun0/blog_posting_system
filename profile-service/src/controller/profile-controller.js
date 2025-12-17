require('dotenv').config();
const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');
const { validateUpdateProfile } = require('../utils/validator');
const {publishEvent} = require('../config/connectToRabbitMq');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const redis = require('../config/redisConfig');
const DEFAULT_CACHE_EXPIRY = 5*60*1000;

const updateUserProfile = async(req,res)=>{
        logger.info('Update profile endpoint hit');
        try{
            const {userId} = req.user;
            let avatarId = null;
            let avatarUrl = null;

            // Check if there's any data to update (either body or file)
            const hasBodyData = req.body && Object.keys(req.body).length > 0;
            const hasFile = req.file !== undefined;

            if(!hasBodyData && !hasFile){
                logger.error('No data provided for updating profile');
                return  res.status(400).json({
                    success:false,
                    message:"No data provided for updating profile. Provide bio or avatar."
                })
            }

            // Validate body data only if present
            if(hasBodyData){
                const {error} = await validateUpdateProfile(req.body);
                if(error){
                    logger.error(`Validation Error while updating profile ${error.details[0].message}`);
                    return res.status(400).json({
                        success:false,
                        message:"Validation Error while updating profile",
                        error:error.details[0].message
                    })
                }
            }

            logger.info(`Update request - hasFile: ${hasFile}, hasBodyData: ${hasBodyData}`);
            
            if(req.file){
                logger.info(`File upload detected: ${req.file.originalname}`);
                const formData = new FormData();
                formData.append('file' , fs.createReadStream(req.file.path),req.file.originalname);
                const mediaResponse = await axios.post(
                'http://localhost:3003/api/media/upload',
                    formData,
                    {
                        headers:{
                            ...formData.getHeaders(),
                            'x-user-id': userId
                        }
                    }
                )
                if(mediaResponse.status === 200 && mediaResponse.data.success){
                    avatarId = mediaResponse.data.publicId;
                    avatarUrl = mediaResponse.data.url;
                    logger.info(`File uploaded successfully. PublicId: ${avatarId}`);
                }
            }
            const {bio} = req.body;

            const updateData ={};
            if(bio !== undefined) updateData.bio = bio;
            if(avatarId !== undefined) updateData.avatarId = avatarId;
            const updatedProfile = await UserProfile.findOneAndUpdate({userId},{$set : updateData},{new:true});
            if(!updatedProfile){
                logger.error(`Profile not found for user ${userId}`);
                return res.status(400).json({
                    success:false,
                    message:`Profile not found for user ${userId}`
                })
            }
            logger.info(`Profile updated successfully ${updatedProfile.userId}`);
            res.status(200).json({
                success:true,
                message:`Profile updated successfully with userId ${updatedProfile.userId}`,
                data:updatedProfile
            })
           

        }catch(error){
            logger.error(`Error while updating profile ${error.message}`);
            res.status(500).json({
                success:false,
                message:"Internal Server Error"
            })
        }
}
const getProfile = async(req,res)=>{
    logger.info('Get profile endpoint hit');
    try{
        const {userId} = req.user;
        const paramUserId= req.params.userId;
        const cachedKey = `profile:${paramUserId}`;
        const cachedProfile = await redis.get(cachedKey);
        const isOwner = userId === paramUserId;
        if(cachedProfile){
            console.log('Cache Hit');
            logger.info(`Profile fetched for the user ${paramUserId}`);
            return res.status(200).json({
                success :true,
                message:isOwner ? "You can edit your profile" : `Profile fetched successfully for user ${paramUserId}`,
                data:JSON.parse(cachedProfile)
            })
        }
        console.log('Cache Miss');
        const profile = await UserProfile.findOne({userId:paramUserId});
        if(!profile){
            logger.error(`Profile not found for user ${userId}`);
            return res.status(400).json({
                success:false,
                message:`Profile not found for user ${userId}`
            })
        }
        const profileData = profile.toObject();
        await redis.setex(cachedKey,DEFAULT_CACHE_EXPIRY,JSON.stringify(profileData));
        
        return res.status(200).json({
            success:true,
            message:isOwner ? "You can edit your profile" : `Profile fetched successfully for user ${paramUserId}`,
            data:profileData
        })
        
    }
    catch(error){
        logger.error(`Error while fetching profile ${error.message}`);
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
        if(!avaterToDeleteProfile.avatarId){
            logger.error(`Avatar not found for user ${userId}`);
            return res.status(400).json({
                success:false,
                message:`Avatar not found for user ${userId}`
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

module.exports = {updateUserProfile,deleteAvater,getProfile};