const mongoose = require("mongoose");


const PublishPostSchema = new mongoose.Schema({
    postId : {
        trype : String,
        required : true
    },
    title : {
        type: String
    },
    slug : {
        type: String
    },
    publishedAt : {
        type: Date
    },
    
},{_id : false});

const UserProfileSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    avatarId:{
        type:String
    },
    bio:{
        type:String,
        default:"User hasnt updated bio"
    },
    publishedPost : [
        PublishPostSchema
    ],
    processedEvent : {
        type: [String],
        default:[]
    }
},{timestamps:true});

module.exports = mongoose.model('UserProfile',UserProfileSchema);