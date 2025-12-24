/**
 * Data Migration Script
 * Migrates data from local MySQL to Render PostgreSQL
 * 
 * This script will:
 * 1. Connect to local MySQL database
 * 2. Export all data (users, products, orders, order_items)
 * 3. Connect to Render PostgreSQL database
 * 4. Import all the data
 * 
 * Run: node migrateDataToPostgres.js
 * 
 * Make sure your .env has both MySQL and PostgreSQL credentials
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function migrateData() {
  let mysqlConnection;
  let pgPool;

  try {
    console.log('🔄 Starting data migration from MySQL to PostgreSQL...\n');

    // ===== STEP 1: Connect to MySQL (local) =====
    console.log('📥 Step 1: Connecting to MySQL (source)...');
    const mysqlConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'africa_db'
    };

    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('   ✅ Connected to MySQL\n');

    // ===== STEP 2: Connect to PostgreSQL (Render) =====
    console.log('📤 Step 2: Connecting to PostgreSQL (destination)...');
    const pgConfig = {
      host: process.env.PG_HOST || process.env.DB_HOST,
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || process.env.DB_USER,
      password: process.env.PG_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.PG_DB_NAME || process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    };

    pgPool = new Pool(pgConfig);
    const pgClient = await pgPool.connect();
    console.log('   ✅ Connected to PostgreSQL\n');
    pgClient.release();

    // ===== STEP 3: Export and Import Users =====
    console.log('👥 Step 3: Migrating users...');
    const [users] = await mysqlConnection.query('SELECT * FROM users');
    console.log(`   Found ${users.length} users to migrate`);

    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await pgPool.query(
          'SELECT id FROM users WHERE email = $1 OR username = $2',
          [user.email, user.username]
        );

        if (existingUser.rows.length === 0) {
          await pgPool.query(
            `INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              user.id,
              user.username,
              user.email,
              user.password,
              user.role,
              user.is_active !== undefined ? user.is_active : true,
              user.created_at,
              user.updated_at || user.created_at
            ]
          );
          console.log(`   ✓ Migrated user: ${user.username}`);
        } else {
          console.log(`   ⊙ User already exists: ${user.username}`);
        }
      } catch (error) {
        console.error(`   ✗ Error migrating user ${user.username}:`, error.message);
      }
    }

    // Reset sequence for users table
    await pgPool.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
    console.log('   ✅ Users migration complete\n');

    // ===== STEP 4: Export and Import Products =====
    console.log('📦 Step 4: Migrating products...');
    const [products] = await mysqlConnection.query('SELECT * FROM products');
    console.log(`   Found ${products.length} products to migrate`);

    for (const product of products) {
      try {
        // Check if product already exists
        const existingProduct = await pgPool.query(
          'SELECT id FROM products WHERE id = $1',
          [product.id]
        );

        if (existingProduct.rows.length === 0) {
          await pgPool.query(
            `INSERT INTO products (id, name, price, description, image, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              product.id,
              product.name,
              product.price,
              product.description || '',
              product.image || '',
              product.created_at,
              product.updated_at || product.created_at
            ]
          );
          console.log(`   ✓ Migrated product: ${product.name}`);
        } else {
          console.log(`   ⊙ Product already exists: ${product.name}`);
        }
      } catch (error) {
        console.error(`   ✗ Error migrating product ${product.name}:`, error.message);
      }
    }

    // Reset sequence for products table
    await pgPool.query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");
    console.log('   ✅ Products migration complete\n');

    // ===== STEP 5: Export and Import Orders =====
    console.log('🛒 Step 5: Migrating orders...');
    const [orders] = await mysqlConnection.query('SELECT * FROM orders');
    console.log(`   Found ${orders.length} orders to migrate`);

    for (const order of orders) {
      try {
        // Check if order already exists
        const existingOrder = await pgPool.query(
          'SELECT id FROM orders WHERE id = $1',
          [order.id]
        );

        if (existingOrder.rows.length === 0) {
          await pgPool.query(
            `INSERT INTO orders (id, user_id, total_amount, status, shipping_address, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              order.id,
              order.user_id,
              order.total_amount,
              order.status,
              order.shipping_address || '',
              order.created_at,
              order.updated_at || order.created_at
            ]
          );
          console.log(`   ✓ Migrated order: #${order.id}`);
        } else {
          console.log(`   ⊙ Order already exists: #${order.id}`);
        }
      } catch (error) {
        console.error(`   ✗ Error migrating order #${order.id}:`, error.message);
      }
    }

    // Reset sequence for orders table
    await pgPool.query("SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))");
    console.log('   ✅ Orders migration complete\n');

    // ===== STEP 6: Export and Import Order Items =====
    console.log('📋 Step 6: Migrating order items...');
    const [orderItems] = await mysqlConnection.query('SELECT * FROM order_items');
    console.log(`   Found ${orderItems.length} order items to migrate`);

    for (const item of orderItems) {
      try {
        // Check if order item already exists
        const existingItem = await pgPool.query(
          'SELECT id FROM order_items WHERE id = $1',
          [item.id]
        );

        if (existingItem.rows.length === 0) {
          await pgPool.query(
            `INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              item.id,
              item.order_id,
              item.product_id,
              item.quantity,
              item.price,
              item.created_at
            ]
          );
          console.log(`   ✓ Migrated order item: #${item.id}`);
        } else {
          console.log(`   ⊙ Order item already exists: #${item.id}`);
        }
      } catch (error) {
        console.error(`   ✗ Error migrating order item #${item.id}:`, error.message);
      }
    }

    // Reset sequence for order_items table
    await pgPool.query("SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items))");
    console.log('   ✅ Order items migration complete\n');

    // ===== FINAL SUMMARY =====
    console.log('📊 Migration Summary:');
    const [pgUsers] = await pgPool.query('SELECT COUNT(*) as count FROM users');
    const [pgProducts] = await pgPool.query('SELECT COUNT(*) as count FROM products');
    const [pgOrders] = await pgPool.query('SELECT COUNT(*) as count FROM orders');
    const [pgOrderItems] = await pgPool.query('SELECT COUNT(*) as count FROM order_items');

    console.log(`   Users: ${pgUsers.rows[0].count}`);
    console.log(`   Products: ${pgProducts.rows[0].count}`);
    console.log(`   Orders: ${pgOrders.rows[0].count}`);
    console.log(`   Order Items: ${pgOrderItems.rows[0].count}`);

    console.log('\n✅ Data migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    process.exit(1);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    if (pgPool) {
      await pgPool.end();
    }
  }
}

// Check if user wants to migrate
console.log('⚠️  This script will migrate data from your LOCAL MySQL to Render PostgreSQL');
console.log('   Make sure you have:');
console.log('   1. Local MySQL database with data');
console.log('   2. PostgreSQL credentials in .env (PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB_NAME)');
console.log('   3. Or use DB_HOST, DB_PORT, etc. for PostgreSQL if you only have one DB\n');

migrateData();

