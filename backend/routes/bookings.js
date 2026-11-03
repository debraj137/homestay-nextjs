const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = auth;


router.post('/', auth, bookingsController.createBooking);
console.log('rrrrrdd')
router.get('/user/:userId', auth, bookingsController.getUserBookings);
router.put("/:bookingId/cancel", auth, bookingsController.cancelBooking);
// Admin can modify booking
router.put('/:bookingId/modify', auth, requireRole('admin'), bookingsController.modifyBookingByAdmin);
module.exports = router;
