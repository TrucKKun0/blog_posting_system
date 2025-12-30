const mongoose = require("mongoose");


const PublishPostSchema = new mongoose.Schema({
    postId : {
        trype : String
        
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
        type:String,
        required:true,
        unique:true
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