import pg from 'pg';

const { Pool } = pg;

let pool = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('connect', () => {
    console.log('[DB] Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client', err);
  });
} else {
  console.log('[DB] DATABASE_URL not set. Running in modular in-memory database fallback mode.');
}

export const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database connection not configured. Using modular fallback state.');
  }
  return pool.query(text, params);
};

export default pool;
