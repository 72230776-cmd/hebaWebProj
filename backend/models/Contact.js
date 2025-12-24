const db = require('../config/database');

class Contact {
  // Get all contacts
  static async findAll() {
    const query = `
      SELECT * FROM contacts 
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

  // Get contact by ID
  static async findById(id) {
    const query = 'SELECT * FROM contacts WHERE id = ?';
    if (db.dbType === 'postgres') {
      const result = await db.promisePool.query('SELECT * FROM contacts WHERE id = $1', [id]);
      return result.rows[0] || null;
    } else {
      const [rows] = await db.promisePool.execute(query, [id]);
      return rows[0] || null;
    }
  }

  // Create a new contact submission
  static async create(contactData) {
    const { name, email, message } = contactData;
    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    
    if (db.dbType === 'postgres') {
      const result = await db.promisePool.query(
        'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
        [name, email, message]
      );
      return result.rows[0];
    } else {
      const [result] = await db.promisePool.execute(query, [name, email, message]);
      return await this.findById(result.insertId);
    }
  }

  // Delete contact
  static async delete(id) {
    if (db.dbType === 'postgres') {
      await db.promisePool.query('DELETE FROM contacts WHERE id = $1', [id]);
    } else {
      await db.promisePool.execute('DELETE FROM contacts WHERE id = ?', [id]);
    }
    return true;
  }
}

module.exports = Contact;

