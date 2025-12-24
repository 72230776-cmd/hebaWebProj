const Booking = require('../models/Booking');

// Create booking (public - no auth required)
exports.createBooking = async (req, res) => {
  try {
    const { name, phone, email, orderType, date, time, description } = req.body;

    // Validation
    if (!name || !phone || !orderType || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, order type, date, and time are required'
      });
    }

    // Create booking
    const booking = await Booking.create({
      name,
      phone,
      email: email || null,
      order_type: orderType,
      appointment_date: date,
      appointment_time: time,
      description: description || null
    });

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.delete(id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

