const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');


router.post('/', bookingsController.createBooking);


module.exports = router;