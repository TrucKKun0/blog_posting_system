const mongoose = require("mongoose");

const userLikeReferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['post', 'comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
userLikeReferenceSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model("UserLikeReference", userLikeReferenceSchema);
