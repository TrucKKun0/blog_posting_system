const mongoose =  requre('mongoose');

const followSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    follwerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    followingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, { timestamps : true })

followSchema.index({ followingId : 1, followerId : 1}, { unique : true })

module.exports = mongoose.model("Follow", followSchema);