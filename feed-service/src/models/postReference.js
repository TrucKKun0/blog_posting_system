const mongoose = require("mongoose");

const postReferenceSchema = new mongoose.Schema({
    postId : {
        type : String,
        unique : true
    },
    authorId  :{
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    mediaUrl : {
        type : String,
        
    },
    interactionId  : {
        type : String,
    }
},{timestamps : true});

postReferenceSchema.index({postId : 1, authorId : 1,interactionId : 1,unique : true});

module.exports = mongoose.model("PostRefrence", postReferenceSchema);