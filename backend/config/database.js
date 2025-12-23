const dotenv = require('dotenv');
dotenv.config();

// Determine database type
// Check DB_TYPE first, then check port (5432 = PostgreSQL, 3306 = MySQL)
const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
const DB_TYPE = process.env.DB_TYPE || (DB_PORT === 5432 ? 'postgres' : 'mysql');

let pool;
let promisePool;
let dbType = DB_TYPE;

if (DB_TYPE === 'postgres' || DB_PORT === 5432) {
  // PostgreSQL connection
  const { Pool: PgPool } = require('pg');
  
  const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'africa_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };

  pool = new PgPool(pgConfig);
  dbType = 'postgres';

  // Create a promisePool-like interface for PostgreSQL
  promisePool = {
    execute: async (query, params) => {
      // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
      if (params && params.length > 0) {
        let paramIndex = 1;
        const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
        const result = await pool.query(pgQuery, params);
        // For INSERT with RETURNING, the id is in result.rows[0].id
        // For regular queries, result.rows contains the data
        return [result.rows, result];
      } else {
        const result = await pool.query(query);
        return [result.rows, result];
      }
    },
    query: async (query, params) => {
      if (params && params.length > 0) {
        let paramIndex = 1;
        const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
        return await pool.query(pgQuery, params);
      } else {
        return await pool.query(query);
      }
    },
    getConnection: async () => {
      const client = await pool.connect();
      return {
        execute: async (query, params) => {
          if (params && params.length > 0) {
            let paramIndex = 1;
            const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
            const result = await client.query(pgQuery, params);
            return [result.rows, result];
          } else {
            const result = await client.query(query);
            return [result.rows, result];
          }
        },
        query: async (query, params) => {
          if (params && params.length > 0) {
            let paramIndex = 1;
            const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
            return await client.query(pgQuery, params);
          } else {
            return await client.query(query);
          }
        },
        beginTransaction: async () => {
          await client.query('BEGIN');
        },
        commit: async () => {
          await client.query('COMMIT');
        },
        rollback: async () => {
          await client.query('ROLLBACK');
        },
        release: () => {
          client.release();
        }
      };
    }
  };

  // Test connection
  pool.connect()
    .then(client => {
      console.log('✅ PostgreSQL connection pool created');
      client.release();
    })
    .catch(err => {
      console.error('❌ PostgreSQL connection failed:', err.message);
    });

} else {
  // MySQL connection
  const mysql = require('mysql2');
  
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'africa_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  promisePool = pool.promise();
  dbType = 'mysql';

  // Test connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ MySQL connection failed:', err.message);
    } else {
      console.log('✅ MySQL connection pool created');
      connection.release();
    }
  });
}

// Helper function to get insertId (works for both MySQL and PostgreSQL)
function getInsertId(result, dbType) {
  if (dbType === 'postgres') {
    // PostgreSQL returns the inserted row with id
    return result.rows && result.rows[0] ? result.rows[0].id : result.insertId;
  } else {
    // MySQL
    return result.insertId;
  }
}

// Helper function to get affectedRows
function getAffectedRows(result, dbType) {
  if (dbType === 'postgres') {
    return result.rowCount || 0;
  } else {
    return result.affectedRows || 0;
  }
}

module.exports = pool;
module.exports.promisePool = promisePool;
module.exports.dbType = dbType;
module.exports.getInsertId = getInsertId;
module.exports.getAffectedRows = getAffectedRows;
