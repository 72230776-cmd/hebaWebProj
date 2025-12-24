/**
 * Check PostgreSQL Database Tables and Data
 * This script will show what tables and data exist in your Render PostgreSQL database
 * 
 * Run: node checkPostgresTables.js
 */

require('dotenv').config();
const { Pool } = require('pg');

async function checkDatabase() {
  let pool;

  try {
    console.log('🔍 Checking PostgreSQL database...\n');

    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'africa_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    console.log('📊 Connecting to:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}\n`);

    pool = new Pool(dbConfig);
    const client = await pool.connect();
    console.log('✅ Connected successfully!\n');

    // Check tables
    console.log('📋 Checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No tables found in the database!');
      console.log('   You need to run: node setupDatabasePostgres.js\n');
    } else {
      console.log(`   ✅ Found ${tablesResult.rows.length} table(s):`);
      tablesResult.rows.forEach((row) => {
        console.log(`      - ${row.table_name}`);
      });
      console.log('');

      // Check data in each table
      for (const table of tablesResult.rows) {
        const tableName = table.table_name;
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = countResult.rows[0].count;
        console.log(`   📊 ${tableName}: ${count} record(s)`);

        // Show sample data for users and products
        if (tableName === 'users' && count > 0) {
          const usersResult = await client.query(`
            SELECT id, username, email, role, is_active 
            FROM users 
            ORDER BY id
          `);
          console.log('      Users:');
          usersResult.rows.forEach(user => {
            console.log(`         - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Active: ${user.is_active}`);
          });
        }

        if (tableName === 'products' && count > 0) {
          const productsResult = await client.query(`
            SELECT id, name, price 
            FROM products 
            ORDER BY id
          `);
          console.log('      Products:');
          productsResult.rows.forEach(product => {
            console.log(`         - ID: ${product.id}, Name: ${product.name}, Price: $${product.price}`);
          });
        }
      }
    }

    console.log('\n✅ Database check complete!');

  } catch (error) {
    console.error('\n❌ Error checking database:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure PostgreSQL is accessible!');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed! Check your credentials.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist!');
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

checkDatabase();

