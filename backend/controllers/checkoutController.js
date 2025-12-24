const Order = require('../models/Order');
const Address = require('../models/Address');
const User = require('../models/User');
const emailService = require('../services/emailService');

// Create order from checkout (with address and shipping)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, address, address_id, save_address, shipping_cost } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);

    // Shipping cost (default $5.00)
    const finalShippingCost = parseFloat(shipping_cost) || 5.00;

    // Total amount (subtotal + shipping)
    const totalAmount = subtotal + finalShippingCost;

    // Handle address
    let addressId = address_id || null;
    let shippingAddressText = '';

    if (address && !address_id) {
      // Create new address if provided and not using existing address_id
      if (save_address) {
        const newAddress = await Address.create({
          user_id: userId,
          full_name: address.full_name,
          street_address: address.street_address,
          city: address.city,
          state: address.state,
          zip_code: address.zip_code,
          country: address.country || 'Lebanon',
          phone: address.phone,
          is_default: address.is_default || false
        });
        addressId = newAddress.id;
        shippingAddressText = Address.formatAddress(newAddress);
      } else {
        // Just use address text without saving
        shippingAddressText = Address.formatAddress(address);
      }
    } else if (address_id) {
      // Use existing address
      const existingAddress = await Address.findById(address_id);
      if (existingAddress && existingAddress.user_id === userId) {
        shippingAddressText = Address.formatAddress(existingAddress);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid address'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Create order with status 'delivering'
    const order = await Order.create({
      user_id: userId,
      total_amount: subtotal, // Subtotal without shipping
      shipping_address: shippingAddressText,
      shipping_cost: finalShippingCost,
      address_id: addressId,
      status: 'delivering',
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // Get order with items for email
    const orderItems = await Order.getOrderItems(order.id);
    const user = await User.findById(userId);

    // Send invoice email
    try {
      await emailService.sendInvoiceEmail(order, user, orderItems);
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          ...order,
          items: orderItems,
          subtotal: subtotal,
          shipping_cost: finalShippingCost,
          total: totalAmount
        }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

