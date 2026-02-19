const mongoose = require("mongoose");

const postRefrenceSchema = mongoose.Schema({
    postId : {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    createdAt : {
        type : Date,
        required : true
    }
},{timestamps : true});

module.exports = mongoose.model("PostRefrence", postRefrenceSchema);