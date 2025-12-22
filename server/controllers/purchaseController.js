const purchaseService = require('../services/purchaseService');

// Mua sách
exports.purchaseBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: bookId } = req.params;

        const result = await purchaseService.purchaseBook(userId, bookId);
        res.json({ message: 'Mua sách thành công', transaction: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};