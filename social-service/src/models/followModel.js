const mongoose =  requre('mongoose');

const followSchema = new mongoose.Schema({
   
    followerId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    followingId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
}, { timestamps : true })

followSchema.index({ followingId : 1, followerId : 1}, { unique : true })

module.exports = mongoose.model("Follow", followSchema);