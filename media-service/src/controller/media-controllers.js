const logger = require('../utils/logger');
const {uploadToCloudinary} = require('../utils/cloudinary');
const Media = require('../models/mediaModel');
const {publishEvent} = require('../utils/rabbitmq');
const {validateUploadMedia} = require('../utils/validator');
const uploadMedia =async (req,res)=>{
    logger.info("Upload media endpoint hit");
    try{
        const {error} = await validateUploadMeadi(req.body);
        if(error){
            logger.error(`Validation Error while uploading media ${error.details[0].message}`);
            return res.status(400).json({
                success:false,
                message:"Validation Error while uploading media",
                error:error.details[0].message
            })
        }
        if(!req.file){
            logger.error("No file provided");
            return res.status(400).json({
                success:false,
                message:"No file provided"
            })
        }
        const {originalName,mimeType,buffer} = req.file;
        const {userid}= req.user;
        logger.info(`Uploading file: ${originalName} for user: ${userid} and mimeType: ${mimeType}`);
        const cloudinaryUploadResult = await uploadToCloudinary(req.file);
        logger.info("Uploading media to cloudinary successfull. Public Id:"+cloudinaryUploadResult.public_id);

        const newCreatedMedia = await Media.create({
            publicId: cloudinaryUploadResult.public_id,
            originalName,
            mimeType,
            userId:userid,
            url:cloudinaryUploadResult.secure_url
        });
        await publishEvent('profile.created',{
            userId:userid,
            avatarId : newCreatedMedia.publicId
        })
        logger.info(`Media uploaded successfully ${newCreatedMedia._id}`);
        res.status(200).json({
            success:true,
            message:"Media uploaded successfully",
            mediaId:newCreatedMedia._id
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