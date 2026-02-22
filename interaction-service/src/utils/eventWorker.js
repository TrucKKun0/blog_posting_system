const OutBoxEvent = require("../models/OutBoxModel");

const {publishEvent} = require("../config/rabbitMqConfig");

const publishOutBoxEvent = async()=>{
    const events = await OutBoxEvent.find({status : "PENDING"}).limit(10).lean();
    for(const event of events){
        try{
            await publishEvent(event.eventType,{
                eventId : event.eventId,
                occuredAt : event.occuredAt,
                data : event.payload
            });
            event.status("PROCESSED");
            await event.save();
            logger.info("Event published successfully with event id:",event.eventId);

        }catch(error){
            logger.error("Error while publishing event with event id:",event.eventId);
            event.status = "FAILED";
            await event.save();
            continue;
        }
    }

}

module.exports = {publishOutBoxEvent};