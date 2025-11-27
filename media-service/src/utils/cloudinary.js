require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

cloudinary.config({
    cloud_name : process.env.cloud_name,
    aoi_key : process.env.api_key,
    api_secret : process.env.api_secret

})

const uploadToCloudinary = async (file)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type : "auto"
        },
        (error,result)=>{
            if(error){
                logger.error(`Error while uploading to cloudinary ${error.message}`);
                 return reject(error);
            }
            resolve(result);
        }
    )
    uploadStream.end(file.buffer);
    })
}
const deleteMediaFromCloudinary = async (publicId)=>{
    try{
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info(`Media deleted from cloudinary with publicId: ${publicId}`);
        return result;
    }catch(error){
        logger.error(`Error while deleting media from cloudinary ${error.message}`);
        throw error;
    }
}

module.exports = {uploadToCloudinary, deleteMediaFromCloudinary};