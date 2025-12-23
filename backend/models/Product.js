const db = require('../config/database');

class Product {
  // Get all products
  static async findAll() {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const [rows] = await db.promisePool.execute(query);
    return rows;
  }

  // Get product by ID
  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await db.promisePool.execute(query, [id]);
    return rows[0] || null;
  }

  // Create a new product
  static async create(productData) {
    const { name, price, description, image } = productData;
    const query = 'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)';
    const [result] = await db.promisePool.execute(query, [name, price, description, image]);
    
    return {
      id: result.insertId,
      name,
      price,
      description,
      image
    };
  }

  // Update a product
  static async update(id, productData) {
    const { name, price, description, image } = productData;
    const query = 'UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?';
    await db.promisePool.execute(query, [name, price, description, image, id]);
    
    return await this.findById(id);
  }

  // Delete a product
  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.promisePool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;


