# BookShare Backend - TODO Checklist

## 🔴 Lõi (Core)

- [ ] Tạo các bảng trong Supabase (users, categories, books, transactions)
- [ ] Chạy script migration từ MySQL sang Supabase
- [ ] Cấu hình biến môi trường (.env)
- [ ] Kiểm tra kết nối Supabase
- [ ] Test API tìm kiếm sách
- [ ] Test API danh mục
- [ ] Test API người dùng (profile, avatar)
- [ ] Test API ví (topup, transactions)
- [ ] Test API mua sách (logic giao dịch)

## 👤 Người Dùng (User Management)

- [ ] Bổ sung JWT middleware để bảo vệ routes
- [ ] Thêm API lấy danh sách người dùng
- [ ] Thêm API cập nhật thông tin hồ sơ
- [ ] Thêm API xóa tài khoản
- [ ] Kiểm tra validation input

## 🚀 Cải Thiện (Improvements)

- [ ] Thêm pagination cho API search
- [ ] Thêm caching layer (Redis)
- [ ] Thêm logging toàn bộ requests
- [ ] Thêm rate limiting
- [ ] Thêm error handling tốt hơn
- [ ] Thêm unit tests
- [ ] Thêm API documentation (Swagger)
- [ ] Triển khai production (PM2, Nginx)
- [ ] Thiết lập CI/CD

## 📋 Danh Sách Các API Đã Hoàn Thành

1. ✅ GET `/api/categories` - Lấy danh sách danh mục
2. ✅ GET `/api/books/search` - Tìm kiếm sách
3. ✅ GET `/api/categories/:slug/books` - Lấy sách theo danh mục
4. ✅ GET `/api/authors/:name/books` - Lấy sách theo tác giả
5. ✅ GET `/api/users/me` - Lấy hồ sơ người dùng
6. ✅ POST `/api/users/avatar` - Upload avatar
7. ✅ POST `/api/wallet/topup` - Nạp tiền vào ví
8. ✅ GET `/api/transactions` - Lấy lịch sử giao dịch
9. ✅ POST `/api/books/:id/purchase` - Mua sách
10. ✅ POST `/api/register` - Đăng ký tài khoản
11. ✅ POST `/api/login` - Đăng nhập
