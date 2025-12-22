require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const tables = ['users', 'categories', 'books', 'orders', 'transactions', 'reviews', 'wishlist'];
  const sql = tables.map(t => `ALTER TABLE public.${t} DISABLE ROW LEVEL SECURITY;`).join('\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing in .env');
    process.exit(1);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('✅ Connected to Postgres');
    console.log('▶️ Running RLS disable statements...');
    await client.query(sql);
    console.log('✅ RLS disabled for tables:', tables.join(', '));
  } catch (err) {
    console.error('❌ Error disabling RLS:', err.message);
  } finally {
    await client.end();
  }
})();
