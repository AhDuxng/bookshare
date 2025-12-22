# Database Setup Instructions

## Required Fields for User Profile Update

To enable profile updates (name, email, phone, gender, address), your Supabase `users` table needs the following fields:

### New Fields to Add:
- `name` - VARCHAR(100) - User's full name
- `phone` - VARCHAR(20) - User's phone number
- `gender` - VARCHAR(20) - Gender ('male', 'female', 'other')
- `address` - TEXT - User's address
- `avatar` - TEXT - Alternative avatar field
- `updated_at` - TIMESTAMP - Last update timestamp

### How to Update Database

#### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → Your Project → SQL Editor
2. Open a new query window
3. Copy and paste the SQL from `server/migrations/001_add_profile_fields.sql`
4. Click "Run" button
5. Verify: Check the `users` table structure in the "Editor" tab

#### Option 2: Using Raw SQL Script

If you have direct database access, run:

```sql
-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update existing records
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

#### Option 3: Recreate Table (For Development Only)

If starting fresh or if you want a clean schema:

```sql
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    gender VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    avatar TEXT,
    balance NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## Verification

After running the migration, verify by checking the table structure:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

Should show these columns:
- id (serial)
- username (varchar)
- email (varchar)
- password (varchar)
- name (varchar) ← NEW
- phone (varchar) ← NEW
- gender (varchar) ← NEW
- address (text) ← NEW
- avatar_url (text)
- avatar (text) ← NEW
- balance (numeric)
- created_at (timestamp)
- updated_at (timestamp) ← NEW

## API Endpoints

Once database is updated, these endpoints will work:

### Get User Profile
```bash
GET /api/users/me
Headers: Authorization: Bearer <token>
```

### Update User Profile
```bash
PUT /api/users/me
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0912345678",
  "gender": "male",
  "address": "123 Main St, City"
}
```

All fields are optional. Only provided fields will be updated.

### Upload Avatar
```bash
PUT /api/users/me/avatar
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body: Form data with 'file' field containing the image
```

## Testing

1. Login to get JWT token
2. Open browser DevTools → Console
3. Update profile through the app
4. Check console logs:
   - Frontend logs in browser console
   - Backend logs in server terminal
5. Verify localStorage and database updates
