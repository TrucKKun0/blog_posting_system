const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        index : true
    },
    targetId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        index : true
    },
    targetType  :{
        type : String,
        enum : ["post", "comment"],
        required : true,
        index : true
    }
},{timestamps : true});

likeSchema.index({userId : 1, targetId : 1, targetType : 1},{unique : true});

module.exports = mongoose.model("Like", likeSchema);