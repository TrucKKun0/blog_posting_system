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
    likeCount : {
        type : Number,
        default : 0
    },
    commentCount : {
        type : Number,
        default : 0
    }
},{timestamps : true});

postReferenceSchema.index({postId : 1, authorId : 1,unique : true});

module.exports = mongoose.model("PostRefrence", postReferenceSchema);