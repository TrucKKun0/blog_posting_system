const mongoose = require("mongoose");

const socialRefrenceSchema = new mongoose.Schema({
    followerId : {
        type : String,
        required : true
     },   followingId : {
        type : String,
        required : true
    }
}, { timestamps: true });
socialRefrenceSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

module.exports = mongoose.model("SocialRefrence", socialRefrenceSchema);