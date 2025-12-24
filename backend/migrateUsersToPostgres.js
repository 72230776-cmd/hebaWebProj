/**
 * Migrate Users from MySQL to PostgreSQL
 * Migrates users from local MySQL to Render PostgreSQL database
 * 
 * Run: node migrateUsersToPostgres.js
 * 
 * Make sure your .env has MySQL credentials for local database
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { Pool } = require('pg');

async function migrateUsers() {
  let mysqlConnection;
  let pgPool;

  try {
    console.log('👥 Migrating users from MySQL to PostgreSQL...\n');

    // ===== STEP 1: Connect to MySQL (local) =====
    console.log('📥 Step 1: Connecting to local MySQL...');
    const mysqlConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DB_NAME || 'africa_db'
    };

    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('   ✅ Connected to MySQL\n');

    // Check users in MySQL
    const [mysqlUsers] = await mysqlConnection.query('SELECT * FROM users');
    console.log(`   Found ${mysqlUsers.length} users in MySQL database\n`);

    if (mysqlUsers.length === 0) {
      console.log('   ℹ️  No users found in MySQL database');
      console.log('   You can create users through the registration API or admin panel\n');
      return;
    }

    // Display users found
    console.log('   Users found:');
    mysqlUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
    });
    console.log('');

    // ===== STEP 2: Connect to PostgreSQL (Render) =====
    console.log('📤 Step 2: Connecting to PostgreSQL (Render)...');
    const pgConfig = {
      host: process.env.DB_HOST || process.env.PG_HOST,
      port: process.env.DB_PORT || process.env.PG_PORT || 5432,
      user: process.env.DB_USER || process.env.PG_USER,
      password: process.env.DB_PASSWORD || process.env.PG_PASSWORD,
      database: process.env.DB_NAME || process.env.PG_DB_NAME,
      ssl: { rejectUnauthorized: false }
    };

    pgPool = new Pool(pgConfig);
    const pgClient = await pgPool.connect();
    console.log('   ✅ Connected to PostgreSQL\n');
    pgClient.release();

    // ===== STEP 3: Migrate Users =====
    console.log('🔄 Step 3: Migrating users...');
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of mysqlUsers) {
      try {
        // Check if user already exists
        const existingUser = await pgPool.query(
          'SELECT id FROM users WHERE email = $1 OR username = $2',
          [user.email, user.username]
        );

        if (existingUser.rows.length > 0) {
          console.log(`   ⊙ Skipped (already exists): ${user.username} (${user.email})`);
          skipped++;
          continue;
        }

        // Insert user into PostgreSQL
        // Note: We need to handle the ID sequence properly
        await pgPool.query(
          `INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            user.id,
            user.username,
            user.email,
            user.password, // Keep the hashed password
            user.role,
            user.is_active !== undefined ? user.is_active : true,
            user.created_at,
            user.updated_at || user.created_at
          ]
        );

        console.log(`   ✓ Migrated: ${user.username} (${user.email}) - Role: ${user.role}`);
        migrated++;
      } catch (error) {
        console.error(`   ✗ Error migrating ${user.username}:`, error.message);
        errors++;
      }
    }

    // Reset sequence for users table to avoid ID conflicts
    try {
      const maxIdResult = await pgPool.query('SELECT MAX(id) as max_id FROM users');
      const maxId = maxIdResult.rows[0]?.max_id || 0;
      if (maxId > 0) {
        await pgPool.query(`SELECT setval('users_id_seq', $1, true)`, [maxId]);
        console.log(`   ✓ Updated users sequence to ${maxId}`);
      }
    } catch (seqError) {
      // Sequence update is optional, don't fail if it errors
      console.log('   ⊙ Could not update sequence (non-critical)');
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Migrated: ${migrated} users`);
    console.log(`   Skipped: ${skipped} users (already exist)`);
    if (errors > 0) {
      console.log(`   Errors: ${errors} users`);
    }

    // Show final count
    const [pgUsers] = await pgPool.query('SELECT COUNT(*) as count FROM users');
    console.log(`   Total users in PostgreSQL: ${pgUsers.rows[0].count}`);

  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL is running locally!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Check your MySQL credentials in .env');
      console.error('   Add: MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME');
    }
    
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

migrateUsers();

