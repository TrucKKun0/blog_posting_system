const mongoose = require("mongoose");

const InteractionRefrenceSchema = new mongoose.Schema({
    postId : {
        type : String,
        unique : true
    },
    likeCount : {
        type : Number,
        default : 0
    },
    commentCount : {
        type : Number,
        default : 0
    }
},{timestamps : true});

const InteractionRefrence = mongoose.model("InteractionRefrence", InteractionRefrenceSchema);
module.exports = InteractionRefrence;