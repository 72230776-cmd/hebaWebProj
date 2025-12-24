const db = require('./config/database');

async function setupTables() {
  try {
    console.log('Creating contacts and bookings tables...');

    // Create contacts table
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
        id ${db.dbType === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INT AUTO_INCREMENT PRIMARY KEY'},
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create bookings table
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id ${db.dbType === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INT AUTO_INCREMENT PRIMARY KEY'},
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        order_type VARCHAR(100) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (db.dbType === 'postgres') {
      await db.promisePool.query(createContactsTable);
      await db.promisePool.query(createBookingsTable);
    } else {
      await db.promisePool.execute(createContactsTable);
      await db.promisePool.execute(createBookingsTable);
    }

    console.log('✅ Contacts and bookings tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

setupTables();

