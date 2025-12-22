# BookShare Backend API - Hướng Dẫn Đầy Đủ

## 📖 Giới Thiệu

BookShare là một ứng dụng thương mại điện tử bán sách trực tuyến được xây dựng với React frontend và Node.js/Express backend. Dự án này sử dụng **Supabase** (PostgreSQL) làm cơ sở dữ liệu để thay thế MySQL.

## 🔗 Danh Sách API

### 📚 Danh Mục & Sách (Books & Categories)

| Phương Thức | Endpoint | Mô Tả |
|-----------|----------|-------|
| GET | `/api/categories` | Lấy danh sách tất cả danh mục |
| GET | `/api/books/search` | Tìm kiếm sách (query, page, limit, sort) |
| GET | `/api/categories/:slug/books` | Lấy sách theo danh mục |
| GET | `/api/authors/:name/books` | Lấy sách theo tác giả |

### 👤 Người Dùng (User)

| Phương Thức | Endpoint | Mô Tả |
|-----------|----------|-------|
| POST | `/api/register` | Đăng ký tài khoản mới |
| POST | `/api/login` | Đăng nhập |
| GET | `/api/users/me` | Lấy thông tin hồ sơ người dùng |
| POST | `/api/users/avatar` | Upload avatar (FormData) |

### 💰 Ví & Giao Dịch (Wallet & Transactions)

| Phương Thức | Endpoint | Mô Tả |
|-----------|----------|-------|
| POST | `/api/wallet/topup` | Nạp tiền vào ví |
| GET | `/api/transactions` | Lấy lịch sử giao dịch |
| POST | `/api/books/:id/purchase` | Mua sách (trừ balance) |

## 🚀 Hướng Dẫn Setup

### 1. Cài Đặt Biến Môi Trường

Sao chép file `.env.example` sang `.env` và điền thông tin Supabase của bạn:

```bash
cp server/.env.example server/.env
```

Nội dung `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-publishable-key
```

### 2. Chạy SQL trong Supabase SQL Editor

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn dự án của bạn
3. Vào **SQL Editor** ở thanh bên trái
4. Tạo query mới và copy toàn bộ nội dung từ file `server/schema.sql`
5. Nhấn **Execute** để tạo bảng và seed dữ liệu mẫu

### 3. Cài Đặt Dependencies

```bash
cd server
npm install
```

Các gói sẽ được cài đặt:
- `express` - Framework backend
- `cors` - Cho phép cross-origin requests
- `bcrypt` - Mã hóa mật khẩu
- `multer` - Upload file
- `@supabase/supabase-js` - Supabase client
- `dotenv` - Quản lý biến môi trường

### 4. Chạy Server

```bash
cd server
node index.js
```

Server sẽ chạy tại: `http://localhost:3000`

Bạn sẽ thấy message:
```
Server đang chạy tại http://localhost:3000
```

## 📤 Hướng Dẫn Production

### Chuyển từ Seed Data sang Real Data

Khi chuyển sang production, bạn cần **xóa dữ liệu mẫu** và giữ lại cơ sở dữ liệu trống:

#### Option 1: Xóa Dữ Liệu Mẫu (Giữ Bảng)

Vào **SQL Editor** trong Supabase và chạy:

```sql
-- Xóa dữ liệu mẫu (giữ nguyên cấu trúc bảng)
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE books CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;
```

#### Option 2: Xóa Toàn Bộ & Tạo Lại (Sạch Hoàn Toàn)

```sql
-- Xóa tất cả bảng
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Sau đó, sao chép lại nội dung từ `server/schema.sql` nhưng **bỏ qua phần INSERT** (chỉ giữ phần CREATE TABLE).

### Thiết Lập PM2 (Quản Lý Process)

```bash
npm install -g pm2

cd server
pm2 start index.js --name "bookshare-api"
pm2 save
pm2 startup
```

Kiểm tra:
```bash
pm2 list
pm2 logs bookshare-api
```

### Thiết Lập Nginx (Reverse Proxy)

Tạo file `/etc/nginx/sites-available/bookshare`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/bookshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 📌 Ghi Chú Quan Trọng

- **JWT Middleware**: Routes hiện tại chưa có JWT protection. Bạn cần thêm middleware xác thực trước khi deploy production.
- **File Upload**: Avatar được lưu trong thư mục `server/uploads/`. Tạo thư mục này nếu chưa có: `mkdir server/uploads`
- **CORS**: Hiện tại cho phép từ tất cả origin. Hạn chế trong production bằng cách cấu hình CORS.
- **Error Handling**: Cần bổ sung try-catch tốt hơn và validate input.

## 🔄 Chuyển Từ MySQL Sang Supabase

Nếu bạn có dữ liệu MySQL cũ, chạy script migration:

```bash
cd server
npm install mysql2  # Nếu chưa cài
node migrate.js
```

Script này sẽ:
1. Đọc dữ liệu từ MySQL (từ `server/db.js`)
2. Chuyển sang Supabase bằng upsert

## 📋 Cấu Trúc Project

```
server/
├── index.js                  # Main server file
├── supabase.js               # Supabase client configuration
├── migrate.js                # Migration script
├── schema.sql                # Database schema + seed data
├── .env.example              # Example environment variables
├── db.js                     # Legacy MySQL connection (không dùng)
├── controllers/              # Route handlers
│   ├── bookController.js
│   ├── userController.js
│   ├── walletController.js
│   ├── transactionController.js
│   ├── purchaseController.js
│   └── categoryController.js
├── services/                 # Business logic
│   ├── bookService.js
│   ├── userService.js
│   ├── walletService.js
│   ├── transactionService.js
│   ├── purchaseService.js
│   └── categoryService.js
└── uploads/                  # Thư mục upload avatar
```

## 🧪 Test API

### Sử dụng cURL:

```bash
# Lấy danh sách danh mục
curl http://localhost:3000/api/categories

# Tìm kiếm sách
curl "http://localhost:3000/api/books/search?query=Harry&page=1&limit=10"

# Đăng ký
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

### Sử dụng Postman:

1. Import URL: `http://localhost:3000`
2. Tạo requests theo danh sách API bên trên
3. Test từng endpoint

## 📚 Thêm Tài Liệu

- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Multer Upload](https://github.com/expressjs/multer)

---

**Made with ❤️ for BookShare**