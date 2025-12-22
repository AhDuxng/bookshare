-- Tắt RLS cho bảng users để cho phép đăng ký
-- Chạy SQL này trong Supabase SQL Editor

-- Tắt RLS cho bảng users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn giữ RLS nhưng cho phép INSERT từ service_role:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Enable insert for service role" ON users
-- FOR INSERT
-- TO service_role
-- WITH CHECK (true);

-- CREATE POLICY "Enable insert for anon users (registration)" ON users
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);
