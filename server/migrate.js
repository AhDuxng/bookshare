require('dotenv').config();
const db = require('./db');
const supabase = require('./supabase');

async function migrateTable(tableName, mapRowFn = (r) => r) {
  try {
    const [rows] = await db.promise().query(`SELECT * FROM ${tableName}`);
    if (!rows || rows.length === 0) {
      console.log(`No rows in ${tableName}, skipping.`);
      return;
    }

    const mapped = rows.map(mapRowFn);
    console.log(`Migrating ${mapped.length} rows to Supabase table '${tableName}' (upsert)...`);

    // Use upsert to avoid duplicates based on primary key `id`
    const { data, error } = await supabase.from(tableName).upsert(mapped, { onConflict: 'id' });
    if (error) {
      console.error(`Supabase error for ${tableName}:`, error);
    } else {
      console.log(`Inserted/updated ${mapped.length} rows into '${tableName}'.`);
    }
  } catch (err) {
    console.error(`Error migrating ${tableName}:`, err);
  }
}

async function run() {
  console.log('Bắt đầu di chuyển dữ liệu từ MySQL -> Supabase');

  // 1) Users
  await migrateTable('users', (r) => ({
    id: r.id,
    username: r.username,
    email: r.email,
    password: r.password,
    created_at: r.created_at || null
  }));

  // 2) Books
  await migrateTable('books', (r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    price: r.price,
    image: r.image,
    category: r.category,
    book_condition: r.book_condition,
    description: r.description,
    user_id: r.user_id,
    created_at: r.created_at || null
  }));

  // 3) Cart
  await migrateTable('cart', (r) => ({
    id: r.id,
    user_id: r.user_id,
    book_id: r.book_id,
    quantity: r.quantity,
    created_at: r.created_at || null
  }));

  // 4) Orders
  await migrateTable('orders', (r) => ({
    id: r.id,
    user_id: r.user_id,
    full_name: r.full_name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    payment_method: r.payment_method,
    total_price: r.total_price,
    created_at: r.created_at || null
  }));

  // 5) Order items
  await migrateTable('order_items', (r) => ({
    id: r.id,
    order_id: r.order_id,
    book_id: r.book_id,
    quantity: r.quantity,
    price: r.price
  }));

  console.log('Di chuyển hoàn tất.');
  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
