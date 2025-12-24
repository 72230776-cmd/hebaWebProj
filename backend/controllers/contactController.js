const Contact = require('../models/Contact');

// Create contact submission (public - no auth required)
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Create contact
    const contact = await Contact.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: 'Contact submission received successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact submission',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();

    res.json({
      success: true,
      data: { contacts }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.delete(id);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};


