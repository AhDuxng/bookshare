# Hướng dẫn khắc phục lỗi đăng ký (Permission Denied)

## Vấn đề
Khi đăng ký tài khoản mới, xuất hiện lỗi: **"permission denied for schema public"** (Error code 42501)

## Nguyên nhân
Supabase có Row Level Security (RLS) đang bật, và API key hiện tại không có quyền INSERT vào bảng `users`.

## Giải pháp

### Cách 1: Cập nhật API Key (Khuyến nghị)

1. Vào **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy **service_role key** (là key có full quyền)
5. Mở file `server/.env`
6. Cập nhật dòng:
   ```
   SUPABASE_SERVICE_KEY=eyJ... (paste full key ở đây)
   ```
7. Restart server

### Cách 2: Tạo RLS Policy cho bảng users

1. Vào **Supabase Dashboard** → **Authentication** → **Policies**
2. Chọn bảng `users`
3. Tạo policy mới:
   - Policy name: `Enable insert for registration`
   - Allowed operation: `INSERT`
   - Target roles: `anon`
   - Using expression: `true`
   - Check expression: `true`
4. Click **Review** và **Save policy**

### Cách 3: Tắt RLS (Không khuyến nghị cho production)

1. Vào **Supabase Dashboard** → **Table Editor**
2. Chọn bảng `users`
3. Click vào icon **Shield** (RLS)
4. Tắt "Enable Row Level Security"

⚠️ **Lưu ý**: Cách 3 sẽ cho phép bất kỳ ai cũng có thể đọc/ghi vào bảng users. Chỉ dùng cho development!

## Kiểm tra

Sau khi áp dụng giải pháp, chạy:

```bash
cd server
node test-register.js
```

Nếu thấy ✅ "User created successfully" là đã thành công!
