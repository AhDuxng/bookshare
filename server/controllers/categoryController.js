const categoryService = require('../services/categoryService');

// Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};