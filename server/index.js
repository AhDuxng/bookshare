const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Import multer để upload file
const path = require('path');     // Import path để xử lý đường dẫn
const supabase = require('./supabase');
const bookController = require('./controllers/bookController');
const userController = require('./controllers/userController');
const walletController = require('./controllers/walletController');
const transactionController = require('./controllers/transactionController');
const purchaseController = require('./controllers/purchaseController');
const categoryController = require('./controllers/categoryController');
const imageController = require('./controllers/imageController');
const cartController = require('./controllers/cartController');
const { validateBookInput } = require('./middleware/validateBook');
const { verifyToken, requireAuth } = require('./middleware/auth');

const app = express();
app.use(cors());
const port = 3000;

// Cho phép nhận dữ liệu JSON
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📍 ${req.method} ${req.path}`);
    if (req.headers.authorization) {
        console.log('   🔐 Auth: Yes');
    }
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('   📦 Body:', JSON.stringify(req.body).substring(0, 100));
    }
    if (req.file) {
        console.log('   📁 File:', req.file.originalname);
    }
    next();
});

// JWT Middleware: verify token từ Authorization header
app.use(verifyToken);

// --- CẤU HÌNH UPLOAD ẢNH (Multer) ---
// Upload vào memory (buffer) để gửi lên hosting bên ngoài
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB mỗi file
    },
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận file ảnh
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
    }
});


// --- CÁC API ---

// API: Upload ảnh lên hosting bên ngoài
app.post('/api/upload-images', upload.array('images', 5), imageController.uploadImages);

// API: Lấy danh sách danh mục
app.get('/api/categories', categoryController.getCategories);

// API: Tìm kiếm sách
app.get('/api/books/search', bookController.searchBooks);

// API: Lấy sách theo danh mục
app.get('/api/categories/:slug/books', bookController.getBooksByCategory);

// API: Lấy sách theo tác giả
app.get('/api/authors/:name/books', bookController.getBooksByAuthor);

// API: Đăng bán sách mới (hỗ trợ upload nhiều ảnh, tối đa 5)
// Tạm thời không require auth để test, sẽ lấy user_id từ body
app.post('/api/books', upload.array('images', 5), validateBookInput, bookController.createBook);

// API: Lấy chi tiết 1 cuốn sách
app.get('/api/books/:id', bookController.getBookById);

// API: Xóa sách
app.delete('/api/books/:id', bookController.deleteBook);

// API: Lấy sách của người dùng
app.get('/api/users/:userId/books', bookController.getUserBooks);

// API: Lấy hồ sơ người dùng
app.get('/api/users/me', userController.getProfile);

// API: Cập nhật hồ sơ người dùng (name, email, phone, gender, address)
app.put('/api/users/me', userController.updateProfile);

// API: Upload avatar (PUT endpoint to match frontend)
app.put('/api/users/me/avatar', upload.single('file'), userController.uploadAvatar);

// API: Upload avatar (POST endpoint for backward compatibility)
app.post('/api/users/avatar', upload.single('avatar'), userController.uploadAvatar);

// API: Nạp tiền vào ví
app.post('/api/wallet/topup', walletController.topupWallet);

// API: Lấy lịch sử giao dịch
app.get('/api/transactions', transactionController.getTransactionHistory);

// API: Mua sách
app.post('/api/books/:id/purchase', purchaseController.purchaseBook);

// Cart APIs
app.get('/api/cart', cartController.getCart);
app.post('/api/cart', cartController.addToCart);
app.put('/api/cart/:id', cartController.updateQuantity);
app.delete('/api/cart/:id', cartController.removeItem);

// API: Đăng Ký tài khoản
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    try {
        console.log('🔐 Starting registration for:', username, email);
        
        // Validate input
        if (!username || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Check if user already exists - check username and email separately
        console.log('🔍 Checking if user already exists...');
        
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id, username, email')
            .or(`username.eq.${username},email.eq.${email}`);

        if (checkError) {
            console.error('❌ Error checking existing user:', checkError);
            
            // If permission error on SELECT, skip check and try insert directly
            if (checkError.code === '42501') {
                console.log('⚠️ Cannot check existing users due to permissions, will try insert...');
            } else {
                return res.status(500).json({ 
                    message: "Lỗi kiểm tra tài khoản", 
                    error: checkError.message,
                    code: checkError.code
                });
            }
        } else if (existingUsers && existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            console.log('❌ User already exists:', existingUser);
            return res.status(400).json({ 
                message: existingUser.username === username 
                    ? "Tên đăng nhập đã tồn tại" 
                    : "Email đã được sử dụng" 
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('✅ Password hashed');

        // Insert new user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ 
                username, 
                email, 
                password: hash,
                balance: 0,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (insertError) {
            console.error('❌ Insert error:', insertError);
            
            // Check for specific error codes
            if (insertError.code === '23505') {
                return res.status(400).json({ message: "Tên đăng nhập hoặc Email đã tồn tại" });
            }
            
            if (insertError.code === '42501') {
                console.error('❌ PERMISSION ERROR: Supabase API key không có quyền INSERT');
                console.error('📖 Xem hướng dẫn khắc phục tại: server/FIX_REGISTRATION_ERROR.md');
                return res.status(500).json({ 
                    message: "Lỗi phân quyền database. Vui lòng cập nhật SUPABASE_SERVICE_KEY trong file .env hoặc tạo RLS policy.",
                    error: "Permission denied",
                    hint: "Xem file server/FIX_REGISTRATION_ERROR.md để biết cách khắc phục"
                });
            }

            return res.status(500).json({ 
                message: "Không thể tạo tài khoản", 
                error: insertError.message,
                code: insertError.code 
            });
        }

        console.log('✅ User registered successfully:', newUser.id);
        res.status(201).json({ 
            message: "Đăng ký thành công!",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('❌ Unexpected error during registration:', err);
        res.status(500).json({ 
            message: "Có lỗi xảy ra khi đăng ký",
            error: err.message 
        });
    }
});

// API 5: Đăng nhập
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
        }

        const isMatch = await bcrypt.compare(password, data.password);
        if (isMatch) {
            // Generate JWT token
            const token = jwt.sign(
                { id: data.id, username: data.username, email: data.email },
                process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                { expiresIn: '7d' }
            );

            res.json({
                message: "Đăng nhập thành công",
                token,
                user: { 
                    id: data.id, 
                    username: data.username, 
                    email: data.email,
                    name: data.name,
                    avatar_url: data.avatar_url,
                    avatar: data.avatar
                }
            });
        } else {
            res.status(401).json({ message: "Sai mật khẩu" });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi xác thực" });
    }
});

app.listen(port, () => {
    console.log(`\n================================`);
    console.log(`✅ Server đang chạy tại http://localhost:${port}`);
    console.log(`📦 Database: Supabase (${process.env.SUPABASE_URL})`);
    console.log(`================================\n`);
});