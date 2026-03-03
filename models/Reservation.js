const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  reservationDate: {
    type: Date,
    required: [true, 'Please add a reservation date'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  coworkingSpace: {
    type: mongoose.Schema.ObjectId,
    ref: 'CoworkingSpace',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
<<<<<<< HEAD

  status: {
  type: String,
  enum: ["BOOKED", "CHECKED_IN", "COMPLETED"],
  default: "BOOKED"
}
=======
>>>>>>> 8666acd9ff9fd63c62c3db61302f0859d6bf6c9b
});

module.exports = mongoose.model('Reservation', ReservationSchema);
