const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const addressController = require('../controllers/addressController');
const checkoutController = require('../controllers/checkoutController');
const orderController = require('../controllers/orderController');

// All routes require authentication
router.use(authenticate);

// Address routes
router.get('/addresses', addressController.getUserAddresses);
router.post('/addresses', addressController.createAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.delete('/addresses/:id', addressController.deleteAddress);
router.put('/addresses/:id/default', addressController.setDefaultAddress);

// Checkout route
router.post('/checkout', checkoutController.createOrder);

// User orders (get their own orders)
router.get('/orders', orderController.getUserOrders);

module.exports = router;

