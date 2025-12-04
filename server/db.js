const mysql = require('mysql2');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',

    password: 'dung12345',
    database: 'bookshare_db',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log('Lỗi kết nối MySQL: ', err.message);
        return;
    }
    console.log('Đã kết nối thành công tới MySQL');
});

module.exports = connection;