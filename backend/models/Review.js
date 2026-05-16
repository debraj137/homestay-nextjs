const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ roomId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
