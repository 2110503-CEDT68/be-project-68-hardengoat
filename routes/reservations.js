const express = require('express');
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
<<<<<<< HEAD
  checkInReservation,
  checkOutReservation
=======
>>>>>>> 8666acd9ff9fd63c62c3db61302f0859d6bf6c9b
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

<<<<<<< HEAD


  router.put('/:id/checkin', protect, authorize('admin', 'user'), checkInReservation);

router.put('/:id/checkout', protect, authorize('admin', 'user'), checkOutReservation);
=======
>>>>>>> 8666acd9ff9fd63c62c3db61302f0859d6bf6c9b
module.exports = router;
