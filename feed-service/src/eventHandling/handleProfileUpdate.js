const logger = require("../utils/logger");
const PostReferenceModel = require("../models/postReference");

const handleProfileAvatarUpdate = async (event) => {
    try {
        const { eventType, data } = event;
        
        if (eventType !== "profile.avatar.updated") {
            return;
        }

        const { userId, avatarUrl } = data;

        logger.info(`Handling profile avatar update event for userId: ${userId}, avatarUrl: ${avatarUrl}`);

        // Update all posts by this author with the new avatar URL
        const result = await PostReferenceModel.updateMany(
            { authorId: userId },
            { $set: { authorAvatarUrl: avatarUrl } }
        );

        logger.info(`Updated avatar URL for ${result.modifiedCount} posts by userId: ${userId}`);

    } catch (error) {
        logger.error(`Error handling profile avatar update event: ${error.message}`);
    }
};

module.exports = { handleProfileAvatarUpdate };
