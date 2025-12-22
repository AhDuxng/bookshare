-- Seed categories data
-- Run this in Supabase SQL Editor to create initial categories

INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Văn học', 'van-hoc', 'Tiểu thuyết, truyện ngắn, thơ ca'),
(2, 'Kinh tế', 'kinh-te', 'Sách về kinh doanh, tài chính, marketing'),
(3, 'Kỹ năng', 'ky-nang', 'Sách phát triển bản thân, kỹ năng mềm'),
(4, 'Truyện tranh', 'truyen-tranh', 'Manga, Comics, Truyện tranh Việt Nam'),
(5, 'Giáo trình', 'giao-trinh', 'Sách giáo khoa, giáo trình đại học')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to continue from 6
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
