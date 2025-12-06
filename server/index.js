const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
const port = 3000;

// Cho phép nhận dữ liệu JSON
app.use(express.json());

app.get ('/api/books', (req, res) => {
    const sql = "SELECT * FROM books";

    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }

        res.json(results);
    })
})

app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM books WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }

        if (results.length === 0) {
            return res.status(404).json({message: "Không tìm thấy sách nào"});
        }

        res.json(results[0]);
    });
});

// API 3: Thêm sách mới (Nhận từ Frontend)
app.post('/api/books', (req, res) => {
    // 1. Lấy dữ liệu người dùng gửi lên
    const { title, price, image } = req.body;
    
    // 2. Câu lệnh SQL để chèn vào bảng
    const sql = "INSERT INTO books (title, price, image, description) VALUES (?, ?, ?, ?)";
    const description = "Sách này do thành viên mới đăng bán."; // Tạm thời để mô tả mặc định

    // 3. Thực thi
    db.query(sql, [title, price, image, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Trả về thông báo thành công
        res.json({ message: "Đăng bán thành công!", id: result.insertId });
    });
});

//API Đăng Ký tài khoản
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    const saltRounds = 10; 

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({error: "Lỗi mã hóa"});
        }

        const sql = "INSERT INTO users (username, email,password) VALUES (?, ?, ?)";
        db.query(sql, [username, email,hash], (err, result) => {
            if(err) {
                //ktra trùng username
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({message: "Tên đăng nhập đã tồn tại"});
                }

                return res.status(500).json({error: err.message});
            }
            res.json({message: "Đăng ký thành công!"});
        });
    });
});

//API đăng nhập
app.post('/api/login', (req, res) => {
    const {username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) {
            return err.status(500).json({error: err.message});
        }
        if (result.length === 0) {
            return err.status(401).json({message: "Tên đăng nhập không tồn tại!"});
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({message: "Lỗi xác thực"});
            }

            if (isMatch) {
                res.json({
                    message: "Đăng nhập thành công",
                    user: {id: user.id, username: user.username, full_name: user.full_name}
                });
            } else {
                res.status(401).json({message: "Sai mật khẩu"});
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
})