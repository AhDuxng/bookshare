const express = require('express');
const cors = require('cors');
const db = require('./db');

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

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
})