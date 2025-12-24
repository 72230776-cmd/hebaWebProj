const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Public route - anyone can submit a booking
router.post('/', bookingController.createBooking);

module.exports = router;

