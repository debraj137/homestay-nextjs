const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');


router.post('/', bookingsController.createBooking);
router.get('/user/:userId', bookingsController.getUserBookings);
router.put("/:bookingId/cancel", bookingsController.cancelBooking);
module.exports = router;