const logger = require('../utils/logger');
const ProcessedEvent = require('../models/processEvent');
const UserProfile = require('../models/userProfile');

const handleUserFollowed =  async (eventData)=>{
    const {eventId,data} = eventData;
    const {followerId , followingId} = data;
    const alreadyProcessEvent = await ProcessedEvent.exists({eventId});
    if(alreadyProcessEvent){
        logger.info(`Event with id ${eventId} has already been processed`);
        return;
    }
    await UserProfile.updateOne({
        userId : followerId
    },
    {
        $inc : {followingCount : 1}
    });

    await UserProfile.updateOne({
        userId : followingId
    },
    {
        $inc : {followerCount : 1}
    })
    await ProcessedEvent.create({eventId});
    logger.info(`Processed user.followed event with id ${eventId}`);

};

module.exports = {handleUserFollowed};
