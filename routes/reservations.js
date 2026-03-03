const express = require('express');
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
  checkInReservation,
  checkOutReservation
} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getReservations)
  .post(protect, authorize('admin', 'user'), addReservation);

router
  .route('/:id')
  .get(protect, getReservation)
  .put(protect, authorize('admin', 'user'), updateReservation)
  .delete(protect, authorize('admin', 'user'), deleteReservation);



  router.put('/:id/checkin', protect, authorize('admin', 'user'), checkInReservation);

router.put('/:id/checkout', protect, authorize('admin', 'user'), checkOutReservation);
module.exports = router;
