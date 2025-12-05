const logger = require('../utils/logger');
const {uploadToCloudinary} = require('../utils/cloudinary');
const Media = require('../models/mediaModel');
const {publishEvent} = require('../config/connectRabbitMq');
const uploadMedia =async (req,res)=>{
    logger.info("Upload media endpoint hit");
    try{
        if(!req.file){
            logger.error("No file provided");
            return res.status(400).json({
                success:false,
                message:"No file provided"
            })
        }

        const {originalname, mimetype, buffer} = req.file;
        const {userId}= req.user;

        logger.info(`Uploading file: ${originalname} for user: ${userId} and mimeType: ${mimetype}`);
        const cloudinaryUploadResult = await uploadToCloudinary(req.file);
        logger.info("Uploading media to cloudinary successfull. Public Id:"+cloudinaryUploadResult.public_id);

        const newCreatedMedia = await Media.create({
            publicId: cloudinaryUploadResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            userId:userId,
            url:cloudinaryUploadResult.secure_url
        });
        await publishEvent('profile.created',{
            userId:userId,
            avatarId : newCreatedMedia.publicId
        })
        logger.info(`Media uploaded successfully ${newCreatedMedia._id}`);
        res.status(200).json({
            success:true,
            message:"Media uploaded successfully",
            mediaId:newCreatedMedia._id,
            publicId: newCreatedMedia.publicId,
            url: newCreatedMedia.url
        })
    }catch(error){
        logger.error(`Error while uploading media ${error.message}`);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


module.exports = {uploadMedia};