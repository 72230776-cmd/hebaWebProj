/**
 * Script to add Address table to PostgreSQL database
 * Run: node config/addAddressTable.js
 */

require('dotenv').config();
const { Pool } = require('pg');

async function addAddressTable() {
  let pool;

  try {
    console.log('📝 Adding Address table to database...\n');

    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'africa_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    pool = new Pool(dbConfig);
    const client = await pool.connect();
    console.log('✅ Connected to database\n');
    client.release();

    // Create Address table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        street_address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100) NOT NULL DEFAULT 'Lebanon',
        phone VARCHAR(20),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('   ✓ Addresses table created/verified');

    // Add shipping_cost and address_id columns to orders table
    try {
      await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 5.00');
      console.log('   ✓ Added shipping_cost column to orders table');
    } catch (error) {
      if (!error.message.includes('duplicate column')) {
        console.log('   ⊙ shipping_cost column may already exist');
      }
    }

    try {
      await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL');
      console.log('   ✓ Added address_id column to orders table');
    } catch (error) {
      if (!error.message.includes('duplicate column')) {
        console.log('   ⊙ address_id column may already exist');
      }
    }

    // Update order status to include 'delivering'
    // For PostgreSQL, we need to check the constraint
    try {
      await pool.query(`
        ALTER TABLE orders 
        DROP CONSTRAINT IF EXISTS orders_status_check
      `);
      await pool.query(`
        ALTER TABLE orders 
        ADD CONSTRAINT orders_status_check 
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivering', 'delivered', 'cancelled'))
      `);
      console.log('   ✓ Updated orders status constraint to include "delivering"');
    } catch (error) {
      console.log('   ⊙ Status constraint update may have issues:', error.message);
    }

    console.log('\n✅ Address table setup complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

addAddressTable();

