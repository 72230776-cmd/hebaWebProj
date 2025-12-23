const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.promisePool.execute(query, [username, email, hashedPassword, role]);
    
    return {
      id: result.insertId,
      username,
      email,
      role
    };
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT id, username, email, password, role, is_active, created_at FROM users WHERE email = ?';
    const [rows] = await db.promisePool.execute(query, [email]);
    return rows[0] || null;
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT id, username, email, password, role, is_active, created_at FROM users WHERE username = ?';
    const [rows] = await db.promisePool.execute(query, [username]);
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ?';
    const [rows] = await db.promisePool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get all users (excluding admins - only regular users)
  static async findAll() {
    const query = 'SELECT id, username, email, role, is_active, created_at FROM users WHERE role = ? ORDER BY created_at DESC';
    const [rows] = await db.promisePool.execute(query, ['user']);
    return rows;
  }

  // Update user password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    await db.promisePool.execute(query, [hashedPassword, id]);
    return true;
  }

  // Toggle user active status (disable/enable)
  static async toggleActive(id) {
    const query = 'UPDATE users SET is_active = NOT is_active WHERE id = ?';
    await db.promisePool.execute(query, [id]);
    return await this.findById(id);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get user without password
  static getUserWithoutPassword(user) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;

