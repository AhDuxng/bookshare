-- Migration: Add profile fields to users table
-- Date: 2025-12-22
-- Description: Add name, phone, gender, address, avatar, updated_at fields to support profile updates

-- Run this SQL in Supabase SQL Editor or use the migration script

-- If the table has existing columns, you may need to alter them first
-- Uncomment and use these ALTER statements if columns already exist:

-- ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Or, if you need to recreate the table completely (for fresh databases):

-- Drop existing users table if you want to start fresh
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table with all necessary fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    gender VARCHAR(20), -- 'male', 'female', 'other'
    address TEXT,
    avatar_url TEXT,
    avatar TEXT,
    balance NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- If the table already exists, add missing columns using ALTER TABLE:
-- (Run only the columns that don't exist in your current table)

ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update any existing records to have sensible defaults
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
