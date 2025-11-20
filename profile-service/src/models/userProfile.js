const mongoose = require("mongoose");

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
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('UserProfile',UserProfileSchema);