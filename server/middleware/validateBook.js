// File: server/middleware/validateBook.js
// Middleware validation cho việc đăng bán sách

const validateBookInput = (req, res, next) => {
    const { title, author, price, category_id } = req.body;
    const errors = [];

    // Validate title
    if (!title || title.trim().length === 0) {
        errors.push('Tiêu đề sách không được để trống');
    } else if (title.length > 255) {
        errors.push('Tiêu đề sách không được vượt quá 255 ký tự');
    }

    // Validate author
    if (!author || author.trim().length === 0) {
        errors.push('Tên tác giả không được để trống');
    } else if (author.length > 100) {
        errors.push('Tên tác giả không được vượt quá 100 ký tự');
    }

    // Validate price
    if (!price) {
        errors.push('Giá không được để trống');
    } else {
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            errors.push('Giá phải là số');
        } else if (parsedPrice <= 0) {
            errors.push('Giá phải lớn hơn 0');
        } else if (parsedPrice > 100000000) {
            errors.push('Giá không được vượt quá 100 triệu');
        }
    }

    // Validate category_id
    if (!category_id) {
        errors.push('Danh mục không được để trống');
    } else {
        const parsedCategoryId = parseInt(category_id);
        if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
            errors.push('Danh mục không hợp lệ');
        }
    }

    // Validate condition (optional)
    const { condition } = req.body;
    if (condition) {
        const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'];
        if (!validConditions.includes(condition)) {
            errors.push('Tình trạng sách không hợp lệ. Chọn: new, like_new, good, fair, poor');
        }
    }

    // Validate description (optional)
    const { description } = req.body;
    if (description && description.length > 5000) {
        errors.push('Mô tả không được vượt quá 5000 ký tự');
    }

    // Nếu có lỗi, trả về response
    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Dữ liệu không hợp lệ',
            details: errors 
        });
    }

    // Không có lỗi, tiếp tục
    next();
};

module.exports = { validateBookInput };