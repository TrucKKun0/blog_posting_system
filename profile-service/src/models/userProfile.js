const mongoose = require("mongoose");

const UserPrfileSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    avatarURL:{
        type:String
    },
    bio:{
        type:String,
        default:"User hasnt updated bio"
    },
    socialLinks:{
        type:Array,
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('UserProfile',UserPrfileSchema);