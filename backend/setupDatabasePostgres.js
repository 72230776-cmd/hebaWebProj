/**
 * PostgreSQL Database Setup Script
 * This script will create the tables in your PostgreSQL database
 * Run: node setupDatabasePostgres.js
 * 
 * Make sure your .env file has:
 * DB_HOST=your-render-db-host
 * DB_PORT=5432
 * DB_USER=your-db-user
 * DB_PASSWORD=your-db-password
 * DB_NAME=your-db-name
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let pool;

  try {
    // Get database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'africa_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    console.log('🔌 Connecting to PostgreSQL...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);

    // Create connection pool
    pool = new Pool(dbConfig);

    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL\n');
    client.release();

    console.log('📝 Creating tables...');

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✓ Users table created/verified');

    // Create Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✓ Products table created/verified');

    // Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('   ✓ Orders table created/verified');

    // Create Order Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('   ✓ Order Items table created/verified');

    // Add is_active column if it doesn't exist (for existing databases)
    try {
      await pool.query('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
      console.log('   ✓ Added is_active column to users table');
    } catch (error) {
      if (!error.message.includes('duplicate column')) {
        // Column already exists, that's fine
      }
    }

    // Create function to update updated_at timestamp (PostgreSQL doesn't have ON UPDATE)
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at
    try {
      await pool.query(`
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('   ✓ Created trigger for users.updated_at');
    } catch (error) {
      // Trigger might already exist
    }

    try {
      await pool.query(`
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('   ✓ Created trigger for products.updated_at');
    } catch (error) {
      // Trigger might already exist
    }

    try {
      await pool.query(`
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('   ✓ Created trigger for orders.updated_at');
    } catch (error) {
      // Trigger might already exist
    }

    console.log('   ✓ All tables created/verified');

    // Create hardcoded admin user
    console.log('\n👤 Creating admin user...');
    const adminConfig = require('./config/adminConfig');
    
    // Check if admin already exists
    const adminCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [adminConfig.ADMIN_EMAIL, adminConfig.ADMIN_USERNAME]
    );

    if (adminCheck.rows.length > 0) {
      console.log('   ✓ Admin user already exists');
    } else {
      // Hash admin password
      const hashedPassword = await bcrypt.hash(adminConfig.ADMIN_PASSWORD, 10);
      
      // Insert admin user
      await pool.query(
        `INSERT INTO users (username, email, password, role) 
         VALUES ($1, $2, $3, $4)`,
        [adminConfig.ADMIN_USERNAME, adminConfig.ADMIN_EMAIL, hashedPassword, adminConfig.ADMIN_ROLE]
      );
      
      console.log('   ✓ Admin user created');
      console.log(`      Username: ${adminConfig.ADMIN_USERNAME}`);
      console.log(`      Email: ${adminConfig.ADMIN_EMAIL}`);
      console.log(`      Password: ${adminConfig.ADMIN_PASSWORD}`);
      console.log('      ⚠️  Change the admin password in production!');
    }

    console.log('\n✅ Database setup completed successfully!\n');

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tables in database:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });

      // Check if users table has any data
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`\n👥 Users in database: ${usersResult.rows[0].count}`);
    } else {
      console.log('   ⚠ No tables found');
    }

    console.log('\n✅ Setup complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Your database is ready to use');
    console.log('   2. You can now start your backend server');
    console.log('   3. Test the API endpoints');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure PostgreSQL is running and accessible!');
      console.error('   - Check your DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in .env');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed!');
      console.error('   - Check your DB_USER and DB_PASSWORD in .env');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist!');
      console.error('   - Make sure the database is created in Render');
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

setupDatabase();

