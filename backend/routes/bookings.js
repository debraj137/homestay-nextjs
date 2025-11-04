const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');


router.post('/', bookingsController.createBooking);
router.get('/user/:userId', bookingsController.getUserBookings);
router.put("/:bookingId/cancel", bookingsController.cancelBooking);
// Admin can modify booking
router.put('/:bookingId/modify', bookingsController.modifyBookingByAdmin);
module.exports = router;