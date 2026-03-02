const mongoose = require('mongoose');

const CoworkingSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    telephoneNumber: {
      type: String,
      required: [true, 'Please add a telephone number'],
    },
    openTime: {
      type: String,
      required: [true, 'Please add an open time'],
    },
    closeTime: {
      type: String,
      required: [true, 'Please add a close time'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate reservations
CoworkingSpaceSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'coworkingSpace',
  justOne: false,
});

module.exports = mongoose.model('CoworkingSpace', CoworkingSpaceSchema);
