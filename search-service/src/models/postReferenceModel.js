const mongoose = require('mongoose');

const postReferenceSchema = new mongoose.Schema({
    postId :{
        type: String,
        required : true
    },
    tittle:{
        type: String,
        required : true
    },
    authorId : {
        type: String,
        required : true
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    content : {
        type: String,
        required : true
    },
    likeCount : {
        type: Number,
        default : 0
    },
    commentCount : {
        type: Number,
        default : 0
    },
    score:{
        type: Number,
        default : 0
    }
})

postReferenceSchema.index({tittle : 'text' , content : 'text',postId : 1,authorId : 1});

module.exports = mongoose.model('PostReference',postReferenceSchema);