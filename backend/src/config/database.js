import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// SSL configuration for production (Railway, Render, etc.)
const isProduction = process.env.NODE_ENV === 'production';
const sslConfig = isProduction
  ? {
      ssl: {
        rejectUnauthorized: false, // Required for Railway and most cloud providers
      },
    }
  : {};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ...sslConfig,
});

pool.on('error', (err) => {
  console.error('⚠️  Unexpected error on idle database client:', err.message);
  // Don't crash the entire app on idle client errors
  // The pool will attempt to reconnect automatically
});

// Log connection info (without exposing credentials)
const dbUrl = process.env.DATABASE_URL || 'Not configured';
const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1].split('/')[0] : 'localhost';
console.log(`📊 Database: ${dbHost} ${isProduction ? '(SSL enabled)' : '(SSL disabled)'}`);

// Test database connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Check your DATABASE_URL and ensure NODE_ENV=production is set');
  });

export default pool;
