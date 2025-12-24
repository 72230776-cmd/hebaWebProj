const Order = require('../models/Order');
const User = require('../models/User');
const Address = require('../models/Address');
const emailService = require('../services/emailService');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItems(order.id);
        return { ...order, items };
      })
    );

    res.json({
      success: true,
      data: { orders: ordersWithItems }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.findByUserId(userId);
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItems(order.id);
        return { ...order, items };
      })
    );

    res.json({
      success: true,
      data: { orders: ordersWithItems }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const items = await Order.getOrderItems(order.id);

    res.json({
      success: true,
      data: { order: { ...order, items } }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Get old order status
    const oldOrder = await Order.findById(orderId);
    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = await Order.updateStatus(orderId, status);

    // Send delivery email if status changed to 'delivered'
    if (status === 'delivered' && oldOrder.status !== 'delivered') {
      try {
        const orderItems = await Order.getOrderItems(orderId);
        const user = await User.findById(order.user_id);
        await emailService.sendDeliveryEmail(order, user, orderItems);
      } catch (emailError) {
        console.error('Email sending failed (non-critical):', emailError);
        // Don't fail the status update if email fails
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};


