const mongoose = require('mongoose');
const logger = require('../utils/logger');

const contentSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        default:""
    }

},{timestamps:true});

contentSchema.index({userId:1});

module.exports = mongoose.model('Content',contentSchema);