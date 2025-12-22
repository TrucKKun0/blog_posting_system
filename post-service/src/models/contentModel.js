const mongoose = require('mongoose');
const logger = require('../utils/logger');

const contentSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true});

module.exports = mongoose.model('Content',contentSchema);