const OutBoxEvent = require("../models/OutBoxModel");
const logger = require("./logger");
const { publishEvent } = require("../config/rabbitMqConfig");

const publishOutBoxEvent = async () => {
    const events = await OutBoxEvent.find({ status: "PENDING" }).limit(10);

    for (const event of events) {
        try {
            await publishEvent(event.eventType, {
                eventId: event.eventId,
                occuredAt: event.occuredAt,
                data: event.payload
            });

            event.status = "PROCESSED";  // ✅ fixed
            await event.save();

            logger.info(`Event published successfully with event id: ${event.eventId}`);  // ✅ fixed

        } catch (error) {
            logger.error(`Error while publishing event with event id: ${event.eventId}`);  // ✅ fixed
            event.status = "FAILED";
            await event.save();
            continue;
        }
    }
};

module.exports = { publishOutBoxEvent };