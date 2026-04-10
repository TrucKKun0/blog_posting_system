const mongoose = require("mongoose");

const InteractionRefrenceSchema = new mongoose.Schema({
    postId : {
        type : String,
        unique : true,
        required : true
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

InteractionRefrenceSchema.index({ postId: 1, unique: true });

module.exports = mongoose.model("InteractionReference", InteractionRefrenceSchema);