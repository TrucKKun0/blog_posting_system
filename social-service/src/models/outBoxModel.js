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
    occuredAt : {
        type : Date,
        required : true
    }
},{ timestamps : true });

module.exports = mongoose.model("OutBoxEvent", OutBoxEventSchema);