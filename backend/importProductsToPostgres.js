/**
 * Import Products from JSON to PostgreSQL
 * Imports products from products.json file to Render PostgreSQL database
 * 
 * Run: node importProductsToPostgres.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function importProducts() {
  let pool;

  try {
    console.log('📦 Importing products from JSON to PostgreSQL...\n');

    // ===== STEP 1: Connect to PostgreSQL =====
    console.log('🔌 Connecting to PostgreSQL...');
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'africa_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    pool = new Pool(dbConfig);
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL\n');
    client.release();

    // ===== STEP 2: Read products.json =====
    console.log('📖 Reading products.json...');
    const jsonPath = path.join(__dirname, '..', 'frontend', 'public', 'products.json');
    
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Products file not found: ${jsonPath}`);
    }

    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`   Found ${productsData.length} products to import\n`);

    // ===== STEP 3: Import Products =====
    console.log('📥 Importing products...');
    let imported = 0;
    let skipped = 0;

    for (const product of productsData) {
      try {
        // Check if product already exists (by id or name)
        const existing = await pool.query(
          'SELECT id FROM products WHERE id = $1 OR name = $2',
          [product.id, product.name]
        );

        if (existing.rows.length > 0) {
          console.log(`   ⊙ Skipped (already exists): ${product.name}`);
          skipped++;
          continue;
        }

        // Insert product
        await pool.query(
          `INSERT INTO products (id, name, price, description, image) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            product.id,
            product.name,
            product.price,
            product.desc || product.description || '',
            product.image || ''
          ]
        );

        console.log(`   ✓ Imported: ${product.name} ($${product.price})`);
        imported++;
      } catch (error) {
        console.error(`   ✗ Error importing ${product.name}:`, error.message);
      }
    }

    // Reset sequence
    await pool.query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");

    console.log('\n✅ Import complete!');
    console.log(`   Imported: ${imported} products`);
    console.log(`   Skipped: ${skipped} products (already exist)`);

    // Show summary
    const result = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log(`   Total products in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('\n❌ Import error:');
    console.error('   Message:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

importProducts();

