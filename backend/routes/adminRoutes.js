const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const contactController = require('../controllers/contactController');
const bookingController = require('../controllers/bookingController');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id/password', userController.updateUserPassword);
router.put('/users/:id/toggle-active', userController.toggleUserActive);

// Order routes
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Contact routes
router.get('/contacts', contactController.getAllContacts);
router.delete('/contacts/:id', contactController.deleteContact);

// Booking routes
router.get('/bookings', bookingController.getAllBookings);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;

