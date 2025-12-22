-- ============================================
-- BookShare Database Schema
-- Database: Supabase PostgreSQL
-- Description: Complete schema for book sharing application
-- ============================================

-- ============================================
-- 1. USERS TABLE - Thông tin người dùng
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    -- Profile Information
    name VARCHAR(100),
    phone VARCHAR(20),
    gender VARCHAR(20), -- 'male', 'female', 'other'
    address TEXT,
    
    -- Avatar
    avatar_url TEXT,    -- Primary avatar URL from IBYTE
    avatar TEXT,        -- Fallback avatar field
    
    -- Wallet
    balance NUMERIC(10, 2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_email_valid CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);


-- ============================================
-- 2. CATEGORIES TABLE - Danh mục sách
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);


-- ============================================
-- 3. BOOKS TABLE - Thông tin sách
-- ============================================
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    
    -- Owner Information
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Book Details
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100),
    description TEXT,
    
    -- Category
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Pricing & Condition
    price NUMERIC(10, 2) NOT NULL,
    condition VARCHAR(50) DEFAULT 'good', -- 'new', 'like_new', 'good', 'fair', 'poor'
    
    -- Images
    image_url TEXT,                    -- Primary image (first upload)
    additional_images TEXT[],          -- Array of additional image URLs
    
    -- Status
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'reserved', 'pending'
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT books_price_positive CHECK (price > 0)
);

-- Indexes for books
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);


-- ============================================
-- 4. ORDERS TABLE - Đơn hàng/Mua sách
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    
    -- User Information
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Book Information
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    
    -- Order Details
    quantity INT DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    
    -- Shipping Information
    shipping_address TEXT,
    shipping_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'cancelled'
    
    -- Payment Status
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    delivered_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT orders_price_positive CHECK (unit_price > 0 AND total_price > 0),
    CONSTRAINT orders_quantity_positive CHECK (quantity > 0),
    CONSTRAINT orders_different_users CHECK (buyer_id != seller_id)
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_book_id ON orders(book_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);


-- ============================================
-- 5. TRANSACTIONS TABLE - Giao dịch ví
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    
    -- User Information
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related Information
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    book_id INT REFERENCES books(id) ON DELETE SET NULL,
    
    -- Transaction Details
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'topup', 'purchase', 'refund', 'earn'
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT transactions_amount_positive CHECK (amount > 0)
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);


-- ============================================
-- 6. REVIEWS TABLE - Đánh giá sách/người bán
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    
    -- Reviewer Information
    reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related Information (Either book or seller)
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Review Content
    rating INT NOT NULL, -- 1-5 stars
    comment TEXT,
    
    -- Status
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT reviews_has_target CHECK (book_id IS NOT NULL OR seller_id IS NOT NULL)
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);


-- ============================================
-- 7. WISHLIST TABLE - Danh sách yêu thích
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    
    -- User Information
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Book Information
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id, book_id)
);

-- Indexes for wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_book_id ON wishlist(book_id);


-- ============================================
-- INITIALIZATION NOTES
-- ============================================
-- Schema Version: 1.0.0
-- Last Updated: 2025-12-22
-- Production Database: This schema is ready for real data
-- 
-- Notes:
-- 1. All tables use serial primary keys (auto-increment)
-- 2. Timestamps use UTC format (NOW() in PostgreSQL)
-- 3. Foreign keys use ON DELETE CASCADE or SET NULL as appropriate
-- 4. Indexes are created on frequently queried columns
-- 5. CHECKs constraints validate data integrity
-- 6. UNIQUE constraints prevent duplicates where needed
-- 7. All monetary values use NUMERIC(10,2) for precision
-- 8. Password hashes should be at least 60 characters (bcrypt)
-- 9. Status fields should match frontend enum values
-- 10. Image URLs can store both primary and array of additional images
-- 11. No sample data included - ready for production use

-- ============================================
-- IMPORTANT: DISABLE RLS FOR ALL TABLES
-- ============================================
-- Without this, you will get "permission denied" errors
-- even with service_role key!

ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS books DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wishlist DISABLE ROW LEVEL SECURITY;
