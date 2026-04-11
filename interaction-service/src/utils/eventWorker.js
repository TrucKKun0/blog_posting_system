const OutBoxEvent = require("../models/OutBoxModel");
const logger = require("./logger");
const { publishEvent } = require("../config/rabbitMqConfig");

const publishOutBoxEvent = async () => {
    const events = await OutBoxEvent.find({ status: "PENDING" }).limit(10);

    if (!events.length) {
        logger.info("No pending outbox events to publish");
        return;
    }

    for (const event of events) {
        logger.info(`Publishing outbox event ${event.eventType} with id ${event.eventId}`);
        try {
            await publishEvent(event.eventType, {
                eventId: event.eventId,
                occuredAt: event.occuredAt,
                data: event.payload
            });

            event.status = "PROCESSED";
            await event.save();

            logger.info(`Event published successfully with event id: ${event.eventId}`);

        } catch (error) {
            logger.error(`Error while publishing event with event id: ${event.eventId}: ${error.message}`);
            event.status = "FAILED";
            await event.save();
            continue;
        }
    }
};

module.exports = { publishOutBoxEvent };