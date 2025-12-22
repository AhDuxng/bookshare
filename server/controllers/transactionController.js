const transactionService = require('../services/transactionService');

// Lấy lịch sử giao dịch
exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await transactionService.getTransactionHistory(userId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};