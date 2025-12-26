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
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Log connection info (without exposing credentials)
const dbUrl = process.env.DATABASE_URL || 'Not configured';
const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1].split('/')[0] : 'localhost';
console.log(`📊 Database: ${dbHost} ${isProduction ? '(SSL enabled)' : '(SSL disabled)'}`);

export default pool;
