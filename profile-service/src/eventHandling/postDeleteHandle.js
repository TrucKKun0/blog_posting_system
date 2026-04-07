const logger = require('../utils/logger');
const {consumerEvent} = require('../config/connectToRabbitMq');
const UserProfile = require('../models/userProfile');

const postDeleteHandle = async (event) =>{
    logger.info(`Received post deletion event: ${JSON.stringify(event)}`);
    try{
        const postId = event.postId;
        const userId = event.userId;

        // Here you can add any additional logic needed to handle the post deletion event
        logger.info(`Handled post deletion event for post ID: ${postId}`);
        const userProfile = await UserProfile.findOneAndUpdate(
            {userId},
            {$pull : {publishedPost : {postId : postId}}},
            {new : true}
        );
        if(!userProfile){
            logger.error(`User profile not found for user ID: ${userId}`);
            return;
        }
        logger.info(`Updated user profile after post deletion for user ID: ${userId}`);


    }catch(error){
        logger.error(`Error handling post deletion event: ${error.message}`);
    }
} 

module.exports = {
    postDeleteHandle
};