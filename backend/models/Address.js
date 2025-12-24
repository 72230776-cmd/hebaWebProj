const db = require('../config/database');

class Address {
  // Create a new address
  static async create(addressData) {
    const { user_id, full_name, street_address, city, state, zip_code, country, phone, is_default } = addressData;
    
    let query = 'INSERT INTO addresses (user_id, full_name, street_address, city, state, zip_code, country, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    if (db.dbType === 'postgres') {
      query += ' RETURNING id';
    }
    const [rows, result] = await db.promisePool.execute(query, [
      user_id,
      full_name,
      street_address,
      city,
      state || null,
      zip_code || null,
      country || 'Lebanon',
      phone || null,
      is_default || false
    ]);

    const id = db.dbType === 'postgres' ? (rows[0] && rows[0].id) : require('../config/database').getInsertId(result, db.dbType);
    
    // If this is set as default, unset other default addresses for this user
    if (is_default) {
      await this.setAsDefault(id, user_id);
    }

    return await this.findById(id);
  }

  // Find address by ID
  static async findById(id) {
    const query = 'SELECT * FROM addresses WHERE id = ?';
    const [rows] = await db.promisePool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get all addresses for a user
  static async findByUserId(userId) {
    const query = 'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC';
    const [rows] = await db.promisePool.execute(query, [userId]);
    return rows;
  }

  // Get default address for a user
  static async findDefaultByUserId(userId) {
    const query = 'SELECT * FROM addresses WHERE user_id = ? AND is_default = TRUE LIMIT 1';
    const [rows] = await db.promisePool.execute(query, [userId]);
    return rows[0] || null;
  }

  // Update address
  static async update(id, addressData) {
    const { full_name, street_address, city, state, zip_code, country, phone, is_default } = addressData;
    
    const query = `
      UPDATE addresses 
      SET full_name = ?, street_address = ?, city = ?, state = ?, zip_code = ?, country = ?, phone = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await db.promisePool.execute(query, [
      full_name,
      street_address,
      city,
      state || null,
      zip_code || null,
      country || 'Lebanon',
      phone || null,
      is_default || false,
      id
    ]);

    // If setting as default, unset other defaults
    if (is_default) {
      const address = await this.findById(id);
      if (address) {
        await this.setAsDefault(id, address.user_id);
      }
    }

    return await this.findById(id);
  }

  // Set address as default (and unset others)
  static async setAsDefault(addressId, userId) {
    // Unset all other default addresses for this user
    await db.promisePool.execute(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
      [userId, addressId]
    );
    // Set this address as default
    await db.promisePool.execute(
      'UPDATE addresses SET is_default = TRUE WHERE id = ?',
      [addressId]
    );
  }

  // Delete address
  static async delete(id) {
    const query = 'DELETE FROM addresses WHERE id = ?';
    const [, result] = await db.promisePool.execute(query, [id]);
    return require('../config/database').getAffectedRows(result, db.dbType) > 0;
  }

  // Format address as string
  static formatAddress(address) {
    if (!address) return '';
    const parts = [
      address.street_address,
      address.city,
      address.state,
      address.zip_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  }
}

module.exports = Address;

