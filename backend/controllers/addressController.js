const Address = require('../models/Address');

// Get all addresses for current user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addresses = await Address.findByUserId(userId);
    
    res.json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { full_name, street_address, city, state, zip_code, country, phone, is_default } = req.body;

    if (!full_name || !street_address || !city || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, street address, city, and country'
      });
    }

    const address = await Address.create({
      user_id: userId,
      full_name,
      street_address,
      city,
      state,
      zip_code,
      country,
      phone,
      is_default
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.id;
    const addressData = req.body;

    // Verify address belongs to user
    const existingAddress = await Address.findById(addressId);
    if (!existingAddress || existingAddress.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const address = await Address.update(addressId, addressData);

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.id;

    // Verify address belongs to user
    const existingAddress = await Address.findById(addressId);
    if (!existingAddress || existingAddress.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    await Address.delete(addressId);

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.id;

    // Verify address belongs to user
    const existingAddress = await Address.findById(addressId);
    if (!existingAddress || existingAddress.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    await Address.setAsDefault(addressId, userId);
    const address = await Address.findById(addressId);

    res.json({
      success: true,
      message: 'Default address updated',
      data: { address }
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

