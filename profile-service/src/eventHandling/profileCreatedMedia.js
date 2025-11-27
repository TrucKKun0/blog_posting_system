const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');

const handleProfileCreated = async (event)=>{
    console.log(event);
    const {userId,avatarId} = event;
    try{
        logger.info(`Handling profile.created event for userId: ${userId} with avatarId: ${avatarId}`);
        const profileToUpdate = await UserProfile.findOne({userId});
        if(!profileToUpdate){
            logger.error(`UserProfile not found for userId: ${userId}`);
            return;
        }
        profileToUpdate.avatarId = avatarId;
        await profileToUpdate.save();
        logger.info(`UserProfile updated successfully for userId: ${userId} with new avatarId: ${avatarId}`);
    }catch(error){

        logger.error(`Error in handling profile.created event: ${error.message}`);
        
    }
    
}

module.exports = {handleProfileCreated};