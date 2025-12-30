const supabase = require('../supabase');

// Get cart items for user with book details
exports.getCartByUser = async (userId) => {
  const { data, error } = await supabase
    .from('cart')
    .select(`id, user_id, book_id, quantity, books(id, title, author, price, image_url)`) // join books
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    cart_id: row.id,
    user_id: row.user_id,
    book_id: row.book_id,
    quantity: row.quantity,
    title: row.books?.title,
    author: row.books?.author,
    price: row.books?.price,
    image: row.books?.image_url,
  }));
};

// Add item (or increase quantity if exists)
exports.addToCart = async (userId, bookId, quantity = 1) => {
  // Check if exists
  const { data: existing, error: checkError } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(checkError.message);
  }

  if (existing) {
    const newQty = existing.quantity + quantity;
    const { error: updateError } = await supabase
      .from('cart')
      .update({ quantity: newQty })
      .eq('id', existing.id);
    if (updateError) throw new Error(updateError.message);
    return { ...existing, quantity: newQty };
  }

  const { data, error } = await supabase
    .from('cart')
    .insert({ user_id: userId, book_id: bookId, quantity })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

exports.updateQuantity = async (cartId, quantity) => {
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

exports.removeItem = async (cartId) => {
  const { error } = await supabase.from('cart').delete().eq('id', cartId);
  if (error) throw new Error(error.message);
};

exports.removeItemByUserAndBook = async (userId, bookId) => {
  const { error } = await supabase.from('cart').delete().eq('user_id', userId).eq('book_id', bookId);
  if (error) throw new Error(error.message);
};
