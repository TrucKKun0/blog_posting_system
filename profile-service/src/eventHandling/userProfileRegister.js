const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');

const handleUserRegister = async (event)=>{
    try{

        const {userId} = event;
        logger.info(`Handling user.registered event for userId: ${userId}`);
        const newProfile = await UserProfile.create({
            userId
        });
        logger.info(`Profile created successfully for userId: ${userId}`);
    }catch(error){
        logger.error(`Error in handling user.registered event: ${error.message}`);

    }
}
module.exports = {handleUserRegister};