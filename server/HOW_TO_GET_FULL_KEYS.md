# Hướng dẫn lấy API Keys đầy đủ từ Supabase

## Các keys hiện tại không đủ dài!

Keys bạn cung cấp:
- `sb_publishable_zgHEeR1ciVDT7hzkVOnk6A_-0M3JJGu` (48 ký tự)
- `sb_secret_2IGEtHZj-V8tZIpBwcrdVg_00dZ8Fjy` (45 ký tự)

**Keys thực từ Supabase thường dài 200-300 ký tự bắt đầu với `eyJ...`**

## Cách lấy keys đúng:

### Bước 1: Vào Supabase Dashboard
1. Truy cập: https://supabase.com/dashboard
2. Đăng nhập
3. Chọn project: **snbrmmxxteatdyqmkeom**

### Bước 2: Lấy API Keys
1. Vào **Settings** → **API** (hoặc **Project Settings** → **API**)
2. Cuộn xuống phần **Project API keys**

### Bước 3: Copy keys
Bạn sẽ thấy 2 keys:

**1. `anon` `public` key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... (rất dài)
```
→ Copy toàn bộ key này vào `SUPABASE_ANON_KEY`

**2. `service_role` `secret` key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... (rất dài, khác với anon key)
```
→ Click **Reveal** hoặc **Show**
→ Copy toàn bộ key này vào `SUPABASE_SERVICE_KEY`

### Bước 4: Cập nhật file .env

Mở file `server/.env` và thay thế:

```env
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M... (paste full anon key)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M... (paste full service_role key)
```

⚠️ **Lưu ý:** Keys phải rất dài (200-300 ký tự), bắt đầu với `eyJ`

### Bước 5: Test lại
```bash
cd server
node test-register.js
```

Nếu thấy ✅ "User created successfully" là thành công!
