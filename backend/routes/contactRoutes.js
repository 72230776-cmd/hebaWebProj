const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route - anyone can submit a contact form
router.post('/', contactController.createContact);

module.exports = router;


