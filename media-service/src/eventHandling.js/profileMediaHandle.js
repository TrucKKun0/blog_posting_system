const logger = require('../utils/logger');
const Media = require('../models/mediaModel');
const { deleteMediaFromCloudinary } = require('../utils/cloudinary');

const handleProfileDeleted = async (event)=>{
    console.log(event,'Event');
    const {publicId} = event;
    try{
        logger.info(`Handling profile.deleted event for publicId: ${publicId}`);
        const mediaToDelete = await Media.findOne({publicId})
        if(!mediaToDelete){
            logger.error(`Media not found for publicId: ${publicId}`);
            return;
        }
        await deleteMediaFromCloudinary(publicId);
        await mediaToDelete.findOneAndDelete({publicId});
        logger.info(`Media deleted successfully for publicId: ${publicId}`);

    }catch(error){
        logger.error(`Error in handling profile.deleted event: ${error.message}`);
    }
    
}

module.exports = {handleProfileDeleted};