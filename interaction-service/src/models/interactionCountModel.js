const mongoose = require("mongoose");

const interactionCountSchema = mongoose.Schema({
    targetId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        index : true
    },
    targetType : {
        type : String,
        enum : ["post","comment"],
        required : true,
        index : true
    },
    likeCount: {
        type : Number,
        default : 0
    },
    commentCount : {
        type : Number,
        default : 0
    }
},{timestamps : true});

interactionCountSchema.index({targetId : 1,targetType : 1},{unique : true});

module.exports = mongoose.model("InteractionCount", interactionCountSchema);