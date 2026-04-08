const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        index : true
    },
    targetId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        index : true
    },
    targetType  :{
        type : String,
        enum : ["post", "comment"],
        required : true,
        index : true
    },
    content : {
        type : String,
        required : true
    },
    likeCount : {
        type : Number,
        default : 0
    },
    replyCount : {
        type : Number,
        default : 0
    },
    parentCommentId : {
        type : mongoose.Schema.Types.ObjectId,
        default : null,
        index : true
    },
    isDeleted:{
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date,
        default : null
    }

},{timestamps : true});

commentSchema.index({targetId : 1,targetType : 1 , userId : 1});

module.exports = mongoose.model("Comment", commentSchema);