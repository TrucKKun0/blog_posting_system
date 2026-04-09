const logger = require('../utils/logger');
const PostReference = require('../models/postReferenceModel');
const ProcessedEvent = require('../models/processEvent');

const handlePostCreatedEvent = async (event)=>{
    logger.info(`Handling PostCreated event: ${JSON.stringify(event)}`);
    try{
        
        const eventId = event.eventId;
        // Check if event has already been processed
        const existingEvent = await ProcessedEvent.findOne({eventId});
        if(existingEvent){
            logger.info(`Event with ID ${eventId} has already been processed. Skipping.`);
            return;
        }
        const {postId,title,authorId,content} = event;
        const newPostReference = await PostReference.create({
            postId,
            title,
            authorId,
            content
        })
        await ProcessedEvent.create({eventId});
        logger.info(`Post reference created for post ID: ${postId} with data: ${JSON.stringify(newPostReference)}`);
    } catch (error) {
        logger.error(`Error occurred while handling PostCreated event: ${error.message}`);
    }
}

const handlePostDeletedEvent = async (event)=>{
    logger.info(`Handling PostDeleted event: ${JSON.stringify(event)}`);
    try{
        
        const eventId = event.eventId;
        // Check if event has already been processed
        const existingEvent = await ProcessedEvent.findOne({eventId});
        if(existingEvent){
            logger.info(`Event with ID ${eventId} has already been processed. Skipping.`);
            return;
        }  
        const {postId} = event;
        await PostReference.findOneAndDelete({postId});
        await ProcessedEvent.create({eventId});
        logger.info(`Post reference deleted for post ID: ${postId}`);
    } catch (error) {
        logger.error(`Error occurred while handling PostDeleted event: ${error.message}`);
    }  
}

module.exports = {handlePostCreatedEvent, handlePostDeletedEvent};