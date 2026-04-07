const mongoose = require('mongoose');

const OutBoxEventSchema = new mongoose.Schema({
    eventId : {
        type : String,
        required : true,
        unique : true
    },
    eventType : {
        type :String,
        required : true
    },
    payload : {
        type : Object,
        required : true
    },
    status : {
        type : String,
        enum : ['PENDING','PROCESSED','FAILED'],
        default : 'PENDING'
    },
    occurredAt : {
        type : Date,
        default : Date.now
    }
},{ timestamps : true });

module.exports = mongoose.model("OutBoxEvent", OutBoxEventSchema);