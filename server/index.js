const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const multer = require('multer'); // Import multer để upload file
const path = require('path');     // Import path để xử lý đường dẫn
const { error } = require('console');

const app = express();
app.use(cors());
const port = 3000;

// Cho phép nhận dữ liệu JSON
app.use(express.json());

// --- CẤU HÌNH UPLOAD ẢNH (Multer) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu file vào thư mục 'uploads/' (Bạn nhớ tạo thư mục này thủ công nhé!)
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Đặt tên file = thời gian hiện tại + đuôi file gốc (để không bị trùng tên)
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Mở công khai thư mục 'uploads' để trình duyệt xem được ảnh
// Ví dụ: http://localhost:3000/uploads/ten-anh.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- CÁC API ---

// API 1: Lấy danh sách sách (Kèm tên người đăng)
app.get('/api/books', (req, res) => {
    // JOIN bảng books với users để lấy username người đăng
    const sql = `
        SELECT books.*, users.username 
        FROM books 
        LEFT JOIN users ON books.user_id = users.id
    `;

    db.query(sql, (err, results) => {
        if(err) {
            console.error("Lỗi lấy danh sách:", err);
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    })
})

// API 2: Lấy chi tiết 1 cuốn sách
app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT books.*, users.username 
        FROM books 
        LEFT JOIN users ON books.user_id = users.id 
        WHERE books.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if(err) return res.status(500).json({error: err.message});
        if (results.length === 0) return res.status(404).json({message: "Không tìm thấy sách"});
        res.json(results[0]);
    });
});

// API 3: Thêm sách mới (QUAN TRỌNG - Hỗ trợ Upload ảnh & Full thông tin)
// upload.single('image') nghĩa là nhận 1 file từ field có tên là 'image'
app.post('/api/books', upload.single('image'), (req, res) => {
    
    // Log để kiểm tra dữ liệu gửi lên
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { 
        title, author, price, category, condition, description, user_id, image: imageLink 
    } = req.body;

    // --- Xử lý Logic chọn ảnh ---
    // 1. Nếu người dùng tải file lên (req.file tồn tại) -> Tạo URL trỏ đến file đó
    // 2. Nếu không -> Dùng link ảnh người dùng nhập (imageLink)
    let finalImage = imageLink;
    if (req.file) {
        finalImage = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    // Câu lệnh SQL (Lưu ý: dùng cột 'book_condition' trong DB)
    const sql = `
        INSERT INTO books 
        (title, author, price, image, category, book_condition, description, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, author, price, finalImage, category, condition, description, user_id], (err, result) => {
        if (err) {
            console.error("Lỗi SQL khi thêm sách:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Đăng bán thành công!", id: result.insertId });
    });
});

// API 4: Đăng Ký tài khoản
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10; 

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({error: "Lỗi mã hóa"});

        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hash], (err, result) => {
            if(err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({message: "Tên đăng nhập hoặc Email đã tồn tại"});
                }
                return res.status(500).json({error: err.message});
            }
            res.json({message: "Đăng ký thành công!"});
        });
    });
});

// API 5: Đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        
        if (result.length === 0) {
            return res.status(401).json({message: "Tên đăng nhập không tồn tại!"});
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({message: "Lỗi xác thực"});

            if (isMatch) {
                res.json({
                    message: "Đăng nhập thành công",
                    // Trả về email thay vì full_name
                    user: {id: user.id, username: user.username, email: user.email}
                });
            } else {
                res.status(401).json({message: "Sai mật khẩu"});
            }
        });
    });
});
//API lấy danh sách giỏ hàng
app.get('/api/cart', (req, res) => {
    const userID = req.query.user_id;

    if (!userID) {
        return res.status(400).json({message: "Thiếu user_id"});
    }

    const sql = `
        SELECT c.id as cart_id, c.quantity, b.id as book_id, b.title, b.price, b.image, b.author 
        FROM cart c
        JOIN books b ON c.book_id = b.id
        WHERE c.user_id = ?
    `

    db.query(sql, [userID], (err, results) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    });
});

// API: Thêm vào giỏ hàng
app.post('/api/cart', (req, res) => {
    const { user_id, book_id, quantity = 1 } = req.body;

    // 1. Kiểm tra xem sách này đã có trong giỏ của user chưa
    const checkSql = "SELECT * FROM cart WHERE user_id = ? AND book_id = ?";
    db.query(checkSql, [user_id, book_id], (err, results) => {
        if(err) return res.status(500).json({error: err.message});

        if (results.length > 0) {
            // 2. Nếu có rồi -> Cộng dồn số lượng
            const newQuantity = results[0].quantity + quantity;
            const updateSql = "UPDATE cart SET quantity = ? WHERE id = ?";
            db.query(updateSql, [newQuantity, results[0].id], (err) => {
                if(err) return res.status(500).json({error: err.message});
                res.json({message: "Đã cập nhật số lượng sách trong giỏ"});
            });
        } else {
            // 3. Nếu chưa có -> Thêm dòng mới
            const insertSql = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";
            db.query(insertSql, [user_id, book_id, quantity], (err) => {
                if(err) return res.status(500).json({error: err.message});
                res.json({message: "Đã thêm vào giỏ hàng thành công"});
            });
        }
    });
});

//API cập nhật số lượng item trong giỏ
app.put('/api/cart/:id', (req, res) => {
    const {quantity} = req.body;
    const cartId = req.params.id;
    const sql = "UPDATE cart SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, cartId], (err) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({message: "Đã cập nhật số lượng"});
    });
});

// API 9: Xóa khỏi giỏ hàng
app.delete('/api/cart/:id', (req, res) => {
    const cartId = req.params.id;
    const sql = "DELETE FROM cart WHERE id = ?";
    
    db.query(sql, [cartId], (err, result) => {
        if (err) {
            console.error("Lỗi xóa giỏ hàng:", err);
            return res.status(500).json({error: err.message});
        }
        res.json({message: "Đã xóa sản phẩm khỏi giỏ hàng"});
    });
});

// API 10: Tạo đơn hàng
app.post('/api/orders', (req, res) => {
    const { user_id, full_name, phone, email, address, payment_method, cart_items, total_price } = req.body;

    // 1. Insert vào bảng orders
    const sqlOrder = `
        INSERT INTO orders (user_id, full_name, phone, email, address, payment_method, total_price )
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(sqlOrder, [user_id, full_name, phone, email, address, payment_method, total_price], (err, result) => {
        if(err) {
            console.error("Lỗi tạo đơn hàng", err);
            return res.status(500).json({error: err.message});
        }

        const orderID = result.insertId;

        // 2. Insert vào bảng order_items (Duyệt qua từng món trong giỏ)
        const sqlOrderItem = "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?";
        const orderItemsData = cart_items.map(item => [orderID, item.book_id, item.quantity, item.price]);

        db.query(sqlOrderItem, [orderItemsData], (err) => {
            if(err) {
                console.error("Lỗi lưu chi tiết đơn hàng", err);
                return res.status(500).json({error: err.message});
            }

            // 3. Xóa giỏ hàng của user sau khi đặt thành công
            const sqlClearCart = "DELETE FROM cart WHERE user_id = ?";
            db.query(sqlClearCart, [user_id], (err) => {
                if (err) {
                    console.error("Lỗi không thể xóa giỏ hàng:", err);
                    return res.status(500).json({error: err.message});
                }
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
})