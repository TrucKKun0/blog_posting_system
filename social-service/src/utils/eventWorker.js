const OutBoxEvent = require("../models/outBoxModel");
const { publishEvent } = require("../config/connectRabbitMq");
const publishOutBoxEvent  =async ()=>{
    const events = await OutBoxEvent.find({status : 'PENDING'}).limit(10).lean();

    for(const event of events){
        try{
            await publishEvent(event.eventType,{
                eventId : event.eventId,
                occurredAt : event.occuredAt,
                data : event.payload
            });
            event.status = 'PROCESSED';
            await event.save();
            console.log(`Event ${event.eventId} published successfully`);
        }catch(error){
            console.error(`Error publishing event ${event.eventId} : ${error.message}`);
            event.status = 'FAILED';
            await event.save();
            continue;
        }
    }
}
module.exports = {publishOutBoxEvent};