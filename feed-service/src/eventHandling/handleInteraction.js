const logger = require('../utils/logger');
const InteractionRefrence = require("../models/interactionRefrence");
const {calculateTrendingScore} = require('../utils/calculateTrendingScore');

const handleInteractionEvent = async (event) => {
    try {
        const { eventType, payload } = event;
        const { postId } = payload;

        logger.info(`Received event: ${eventType} for post: ${postId}`);

        let update = {
            $inc: {},
            $setOnInsert: {
                postId,
                createdAt: new Date()
            }
        };

        if (eventType === "like.created") {
            update.$inc.likeCount = 1;
        } else if (eventType === "comment.created" || eventType === "comment.reply") {
            update.$inc.commentCount = 1;
        } else {
            return;
        }

        const updatedDoc = await InteractionRefrence.findOneAndUpdate(
            { postId },
            update,
            {
                upsert: true,     // create if not exists
                new: true         // return updated doc
            }
        );
        await calculateTrendingScore(postId);

        logger.info(
            `Updated post ${postId} → likes: ${updatedDoc.likeCount}, comments: ${updatedDoc.commentCount}`
        );

    } catch (error) {
        logger.error(`Error handling interaction event: ${error.message}`);
    }
};

module.exports = { handleInteractionEvent };