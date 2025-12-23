const db = require('../config/database');
const { getInsertId, getAffectedRows } = require('../config/database');

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
    let query = 'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)';
    if (db.dbType === 'postgres') {
      query += ' RETURNING id';
    }
    const [rows, result] = await db.promisePool.execute(query, [name, price, description, image]);
    
    const id = db.dbType === 'postgres' ? (rows[0] && rows[0].id) : getInsertId(result, db.dbType);
    
    return {
      id: id,
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
    const [, result] = await db.promisePool.execute(query, [id]);
    return getAffectedRows(result, db.dbType) > 0;
  }
}

module.exports = Product;


