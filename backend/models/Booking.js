const db = require('../config/database');

class Booking {
  // Get all bookings
  static async findAll() {
    const query = `
      SELECT * FROM bookings 
      ORDER BY created_at DESC
    `;
    if (db.dbType === 'postgres') {
      const result = await db.promisePool.query(query);
      return result.rows;
    } else {
      const [rows] = await db.promisePool.execute(query);
      return rows;
    }
  }

  // Get booking by ID
  static async findById(id) {
    if (db.dbType === 'postgres') {
      const result = await db.promisePool.query('SELECT * FROM bookings WHERE id = $1', [id]);
      return result.rows[0] || null;
    } else {
      const [rows] = await db.promisePool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
      return rows[0] || null;
    }
  }

  // Create a new booking
  static async create(bookingData) {
    const { name, phone, email, order_type, appointment_date, appointment_time, description } = bookingData;
    const query = 'INSERT INTO bookings (name, phone, email, order_type, appointment_date, appointment_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    if (db.dbType === 'postgres') {
      const result = await db.promisePool.query(
        'INSERT INTO bookings (name, phone, email, order_type, appointment_date, appointment_time, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, phone, email, order_type, appointment_date, appointment_time, description]
      );
      return result.rows[0];
    } else {
      const [result] = await db.promisePool.execute(query, [name, phone, email, order_type, appointment_date, appointment_time, description]);
      return await this.findById(result.insertId);
    }
  }

  // Delete booking
  static async delete(id) {
    if (db.dbType === 'postgres') {
      await db.promisePool.query('DELETE FROM bookings WHERE id = $1', [id]);
    } else {
      await db.promisePool.execute('DELETE FROM bookings WHERE id = ?', [id]);
    }
    return true;
  }
}

module.exports = Booking;

