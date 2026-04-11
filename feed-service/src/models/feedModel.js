const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    userId : {
        type: String,
        required : true
    },
    postId : {
        type : String,
        required : true
    },
    authorId : {
        type : String,
        required : true
    },
    liekCount : {
        type : Number
       
    },
    commentCount : {
        type : Number
       
    },
    score: {
        type : Number
    }
},{timestamps : true});

feedSchema.index({userId : 1, postId : 1, score : -1});

module.exports = mongoose.model('Feed', feedSchema);
