const logger = require('../utils/logger');
const ProcessedEvent = require('../models/processEvent');
const UserProfile = require('../models/userProfile');

const handleUserFollowed =  async (eventData)=>{
    const {eventId,data} = eventData;
    const {followerId , followingId} = data;

    logger.info(`Processing user.follow event - followerId: ${followerId}, followingId: ${followingId}, eventId: ${eventId}`);

    const alreadyProcessEvent = await ProcessedEvent.exists({eventId});
    if(alreadyProcessEvent){
        logger.info(`Event with id ${eventId} has already been processed`);
        return;
    }

    // Check if profiles exist before updating
    const followerProfile = await UserProfile.findOne({ userId: followerId });
    const followingProfile = await UserProfile.findOne({ userId: followingId });

    logger.info(`Follower profile exists: ${!!followerProfile}, current followingCount: ${followerProfile?.followingCount}`);
    logger.info(`Following profile exists: ${!!followingProfile}, current followerCount: ${followingProfile?.followerCount}`);

    if (!followerProfile) {
        logger.error(`Profile not found for followerId: ${followerId}`);
    }
    if (!followingProfile) {
        logger.error(`Profile not found for followingId: ${followingId}`);
    }

    const followerUpdate = await UserProfile.updateOne({
        userId : followerId
    },
    {
        $inc : {followingCount : 1}
    });

    const followingUpdate = await UserProfile.updateOne({
        userId : followingId
    },
    {
        $inc : {followerCount : 1}
    });

    logger.info(`Follower update result: ${JSON.stringify(followerUpdate)}`);
    logger.info(`Following update result: ${JSON.stringify(followingUpdate)}`);

    // Verify the update actually happened
    const updatedFollowerProfile = await UserProfile.findOne({ userId: followerId });
    const updatedFollowingProfile = await UserProfile.findOne({ userId: followingId });

    logger.info(`After update - Follower followingCount: ${updatedFollowerProfile?.followingCount}`);
    logger.info(`After update - Following followerCount: ${updatedFollowingProfile?.followerCount}`);

    await ProcessedEvent.create({eventId});
    logger.info(`Processed user.follow event with id ${eventId}`);

};
const handleUserUnfollowed = async (eventData) =>{
    const {eventId,data} = eventData;
    const {followerId , followingId} = data;

    logger.info(`Processing user.unfollow event - followerId: ${followerId}, followingId: ${followingId}, eventId: ${eventId}`);

    const alreadyProcessEvent = await ProcessedEvent.exists({eventId});

    if(alreadyProcessEvent){
        logger.info(`Event with id ${eventId} has already been processed`);
        return;
    }

    // Check current counts before decrementing
    const followerProfile = await UserProfile.findOne({ userId: followerId });
    const followingProfile = await UserProfile.findOne({ userId: followingId });

    logger.info(`Before unfollow - Follower followingCount: ${followerProfile?.followingCount}`);
    logger.info(`Before unfollow - Following followerCount: ${followingProfile?.followerCount}`);

    const followerUpdate = await UserProfile.updateOne({
        userId : followerId
    },
    {
        $inc : {followingCount : -1}
    });

    const followingUpdate = await UserProfile.updateOne({
        userId : followingId
    },
    {
        $inc : {followerCount : -1}
    });

    logger.info(`Follower update result: ${JSON.stringify(followerUpdate)}`);
    logger.info(`Following update result: ${JSON.stringify(followingUpdate)}`);

    // Verify the update
    const updatedFollowerProfile = await UserProfile.findOne({ userId: followerId });
    const updatedFollowingProfile = await UserProfile.findOne({ userId: followingId });

    logger.info(`After unfollow - Follower followingCount: ${updatedFollowerProfile?.followingCount}`);
    logger.info(`After unfollow - Following followerCount: ${updatedFollowingProfile?.followerCount}`);

    await ProcessedEvent.create({eventId});
    logger.info(`Processed user.unfollow event with id ${eventId}`);
};

module.exports = {handleUserFollowed, handleUserUnfollowed};
