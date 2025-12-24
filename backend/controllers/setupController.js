const db = require('../config/database');

// Internal function to create tables (can be called directly)
async function createTablesInternal() {
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

    return { success: true, message: 'Contacts and bookings tables created successfully!' };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, message: 'Error creating tables', error: error.message };
  }
}

// Export for use in server.js
exports.createTablesInternal = createTablesInternal;

// HTTP endpoint handler
exports.createTables = async (req, res) => {
  const result = await createTablesInternal();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      message: result.message,
      error: process.env.NODE_ENV === 'development' ? result.error : {}
    });
  }
};

