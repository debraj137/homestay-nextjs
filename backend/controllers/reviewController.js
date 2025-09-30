// controllers/reviewController.js
const Review = require("../models/Review");
const Room = require("../models/Room");

// ✅ Add a review
const addReview = async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;
    const userId = req.user.id; // ✅ assumes authMiddleware sets req.user

    if (!roomId || !rating) {
      return res.status(400).json({ message: "Room ID and rating are required" });
    }

    // ✅ Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ✅ Check if user already reviewed this room
    const existingReview = await Review.findOne({ roomId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this room" });
    }

    // ✅ Create review
    let review = new Review({
      roomId,
      userId,
      rating,
      comment,
      createdAt: new Date(), // store creation date
    });

    await review.save();
    // ✅ Populate the user so frontend immediately gets the name
    review = await review.populate("userId", "name email");
    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Error adding review:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all reviews for a room
const getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.find({ roomId })
      .populate("userId", "name email") // show reviewer details 
      .sort({ createdAt: -1 }); // latest first
    console.log("✅ Fetched reviews length:", reviews.length);
    console.log("✅ Fetched reviews:", reviews);
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err.message);
    res.status(500).json({ message: "Server error" }); 
  }
};

// ✅ Get review summary for a room
const getRoomReviewSummary = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.find({ roomId });
    const total = reviews.length;

    if (total === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }

    // breakdown counts
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach(r => {
      sum += r.rating;
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });

    const averageRating = (sum / total).toFixed(1);

    res.json({
      averageRating,
      totalReviews: total,
      breakdown,
    });
  } catch (err) {
    console.error("❌ Error fetching review summary:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  addReview,
  getRoomReviews,
  getRoomReviewSummary
};
