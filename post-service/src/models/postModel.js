const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"User"
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
},{timestamps:true});

module.exports = mongoose.model('Post',PostSchema);