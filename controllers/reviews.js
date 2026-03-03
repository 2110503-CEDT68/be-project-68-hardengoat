const Review = require("../models/Review");
const Reservation = require("../models/Reservation");

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {
    const { reservationId, rating, comment } = req.body;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // ป้องกันรีวิวก่อนใช้งาน
    if (reservation.status !== "COMPLETED") {
      return res.status(400).json({
        message: "You can review only after completion"
      });
    }

    const review = await Review.create({
      user: req.user.id,
      coworkingSpace: reservation.coworkingSpace,
      reservation: reservationId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET REVIEWS BY COWORKING
exports.getReviewsByCoworking = async (req, res) => {
  try {
    const reviews = await Review.find({
      coworkingSpace: req.params.coworkingId
    }).populate("user", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE REVIEW (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};