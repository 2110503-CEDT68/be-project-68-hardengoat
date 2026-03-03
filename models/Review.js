const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coworkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoworkingSpace",
    required: true
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", ReviewSchema);