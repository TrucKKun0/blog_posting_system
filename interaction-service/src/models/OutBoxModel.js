const mongoose = require("mongoose");

const OutBoxSchema = mongoose.Schema({
    eventId : {
        type : String,
        required : true,
        unique : true
    },
    eventType: {
        type : String,
        required : true
    },
    payload : {
        type : Object,
        required : true
    },
    occuredAt : {
        type : Date,
        default : Date.now()
    },
    status:{
        type : String,
        enum : ['PENDING','PROCESSED','FAILED'],
        default : 'PENDING'
    }
},{timestamps : true});

module.exports = mongoose.model("OutBox", OutBoxSchema);