const db = require('../config/database');

class Order {
  // Get all orders
  static async findAll() {
    const query = `
      SELECT o.*, u.username, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `;
    const [rows] = await db.promisePool.execute(query);
    return rows;
  }

  // Get order by ID
  static async findById(id) {
    const query = `
      SELECT o.*, u.username, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `;
    const [rows] = await db.promisePool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get order items
  static async getOrderItems(orderId) {
    const query = `
      SELECT oi.*, p.name as product_name, p.image 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `;
    const [rows] = await db.promisePool.execute(query, [orderId]);
    return rows;
  }

  // Get orders by user ID
  static async findByUserId(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.promisePool.execute(query, [userId]);
    return rows;
  }

  // Create a new order
  static async create(orderData) {
    const { user_id, total_amount, shipping_address, items } = orderData;
    
    // Start transaction
    const connection = await db.promisePool.getConnection();
    await connection.beginTransaction();

    try {
      // Create order
      const orderQuery = 'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)';
      const [orderResult] = await connection.execute(orderQuery, [user_id, total_amount, shipping_address]);
      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        const itemQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
        await connection.execute(itemQuery, [orderId, item.product_id, item.quantity, item.price]);
      }

      await connection.commit();
      return await this.findById(orderId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update order status
  static async updateStatus(id, status) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    await db.promisePool.execute(query, [status, id]);
    return await this.findById(id);
  }
}

module.exports = Order;


