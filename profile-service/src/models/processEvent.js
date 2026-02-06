const mongoose = require('mongoose');

const processEventSchema = new mongoose.Schema({
    eventId : {
        type : String,
        required : true,
        unique : true
    },
    processedAt : {
        type : Date,
        default : Date.now()
    }
},{timestamps : true});

module.exports = mongoose.model('ProcessedEvent, processeEventSchema');