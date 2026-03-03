const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByCoworking,
  deleteReview
} = require("../controllers/reviews");

const { protect, authorize } = require("../middleware/auth");

// user สร้างรีวิว
router.post("/", protect, createReview);

// ดูรีวิว coworking
router.get("/:coworkingId", getReviewsByCoworking);

// admin ลบรีวิว
router.delete("/:id", protect, authorize("admin"), deleteReview);

module.exports = router;