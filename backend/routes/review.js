const express = require("express");
const { addReview, getRoomReviews,
     getRoomReviewSummary  } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST → add a new review (protected)
router.post("/", authMiddleware, addReview);

// GET → get all reviews for a room
router.get("/:roomId", getRoomReviews);
router.get("/summary/:roomId", getRoomReviewSummary);
module.exports = router;
