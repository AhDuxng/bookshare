require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERROR: SUPABASE_URL hoặc SUPABASE_SERVICE_KEY không được cấu hình!');
  console.error('Vui lòng kiểm tra file .env');
  process.exit(1);
}

console.log('✅ Kết nối Supabase từ:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
