-- Giải pháp 1: Tắt RLS hoàn toàn (dễ nhất)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Hoặc Giải pháp 2: Giữ RLS nhưng cho phép tất cả (nếu giải pháp 1 không work)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop tất cả policies cũ (nếu có)
DROP POLICY IF EXISTS "Enable insert for service role" ON public.users;
DROP POLICY IF EXISTS "Enable registration" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Tạo policies mới cho phép tất cả
CREATE POLICY "Allow all for service role" ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON public.users  
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
