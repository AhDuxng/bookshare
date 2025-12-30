const cartService = require('../services/cartService');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.user_id;
    if (!userId) return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    const items = await cartService.getCartByUser(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user_id;
    const { book_id, quantity = 1 } = req.body;
    if (!userId) return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    if (!book_id) return res.status(400).json({ error: 'Thiếu book_id' });
    const item = await cartService.addToCart(userId, book_id, quantity);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: 'quantity phải >=1' });
    const item = await cartService.updateQuantity(id, quantity);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.removeItem(id);
    res.json({ message: 'Đã xóa khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
