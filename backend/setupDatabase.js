/**
 * Database Setup Script
 * This script will create the database and tables
 * Run: node setupDatabase.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;

  try {
    // Get database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    };

    console.log('🔌 Connecting to MySQL...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Port: ${dbConfig.port}`);

    // Connect to MySQL (without database)
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'config', 'dbSchema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Creating database and tables...');
    
    // Execute SQL statements
    // First, create database
    try {
      await connection.query("CREATE DATABASE IF NOT EXISTS africa_db");
      console.log('   ✓ Database created/verified');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    // Switch to the database
    await connection.query("USE africa_db");
    console.log('   ✓ Using africa_db database');

    // Create users table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('   ✓ Users table created');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
      console.log('   ✓ Users table already exists');
    }

    // Create hardcoded admin user
    console.log('\n👤 Creating hardcoded admin user...');
    const adminConfig = require('./config/adminConfig');
    
    // Check if admin already exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [adminConfig.ADMIN_EMAIL, adminConfig.ADMIN_USERNAME]
    );

    if (existingAdmin.length > 0) {
      console.log('   ✓ Admin user already exists');
    } else {
      // Hash admin password
      const hashedPassword = await bcrypt.hash(adminConfig.ADMIN_PASSWORD, 10);
      
      // Insert admin user
      await connection.query(
        `INSERT INTO users (username, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        [adminConfig.ADMIN_USERNAME, adminConfig.ADMIN_EMAIL, hashedPassword, adminConfig.ADMIN_ROLE]
      );
      
      console.log('   ✓ Admin user created');
      console.log(`      Username: ${adminConfig.ADMIN_USERNAME}`);
      console.log(`      Email: ${adminConfig.ADMIN_EMAIL}`);
      console.log(`      Password: ${adminConfig.ADMIN_PASSWORD}`);
      console.log('      ⚠️  Change the admin password in production!');
    }

    console.log('\n✅ Database and tables created successfully!\n');

    // Verify tables were created
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📊 Tables in database:');
    if (tables.length > 0) {
      tables.forEach((table) => {
        console.log(`   ✓ ${Object.values(table)[0]}`);
      });

      // Check if users table has any data
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`\n👥 Users in database: ${users[0].count}`);
    } else {
      console.log('   ⚠ No tables found');
    }

    console.log('\n✅ Setup complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Register a user through the frontend or API');
    console.log('   2. Or create an admin user: node config/createAdmin.js');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error('   Message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL is running!');
      console.error('   - If using XAMPP: Start MySQL in XAMPP Control Panel');
      console.error('   - If using MySQL directly: Make sure the service is running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Check your database credentials in .env file');
      console.error('   - DB_USER and DB_PASSWORD');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

