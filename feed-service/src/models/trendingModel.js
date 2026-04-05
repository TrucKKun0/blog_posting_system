const mongoose = require("mongoose");

const TrendingSchema = new mongoose.Schema({
    postId : {
        type : String,
        required : true
    },
    likeCount : {
        type : Number,
        default : 0
    },
    commentCount:{
        type :Number,
        default : 0
    },
    createdAt:{
        type  : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date
    },
    score : {
        type : Number,
        required : true
    }
},{timestamps : true});

TrendingSchema.index({postId : 1, unique : true});

module.exports = mongoose.model("Trending", TrendingSchema);