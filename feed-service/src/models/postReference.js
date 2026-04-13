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
    authorName : {
        type : String,
        required : true
    },
    authorAvatarUrl : {
        type : String,
        default : null
    },
    title : {
        type : String,
        required : true
    },
    slug : {
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
    },
    score : {
        type : Number,
        default : 0
    }
},{timestamps : true});

postReferenceSchema.index({postId : 1, authorId : 1});

module.exports = mongoose.model("PostReferenceModel", postReferenceSchema);