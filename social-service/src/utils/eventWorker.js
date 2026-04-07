const { publishEvent } = require("../configs/configRabbitMQ");
const OutBoxModel = require("../models/outBoxModel");
const logger = require('./logger');

const publishOutBoxEvent = async () => {
    try {
        const events = await OutBoxModel.find({ status: 'PENDING' }).limit(10);

        if (events.length === 0) {
            logger.info('No pending events to process');
            return;
        }

        logger.info(`Processing ${events.length} pending events`);

        for (const event of events) {
            try {
                await publishEvent(event.eventType, {
                    eventId: event.eventId,
                    occurredAt: event.occurredAt,
                    data: event.payload
                });

                // Update status and save
                event.status = 'PROCESSED';
                await event.save();
                logger.info(`Event ${event.eventId} published successfully`);
            } catch (error) {
                logger.error(`Error publishing event ${event.eventId}: ${error.message}`);
                event.status = 'FAILED';
                await event.save();
            }
        }

        logger.info('Finished processing outbox events');
    } catch (error) {
        logger.error(`Error in publishOutBoxEvent: ${error.message}`);
    }
}

module.exports = { publishOutBoxEvent };