const walletService = require('../services/walletService');

// Nạp tiền vào ví
exports.topupWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const transaction = await walletService.topupWallet(userId, amount);
        res.json({ message: 'Nạp tiền thành công', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};