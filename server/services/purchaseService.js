const supabase = require('../supabase');

// Mua sách (Giao dịch: kiểm tra balance -> trừ tiền -> ghi chép giao dịch)
exports.purchaseBook = async (userId, bookId) => {
    // Lấy thông tin sách
    const { data: book, error: bookError } = await supabase
        .from('books')
        .select('price')
        .eq('id', bookId)
        .single();

    if (bookError) throw new Error('Sách không tìm thấy');

    // Lấy balance người dùng
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

    if (userError) throw new Error('Người dùng không tìm thấy');

    // Kiểm tra balance
    if (user.balance < book.price) {
        throw new Error('Số dư không đủ');
    }

    // Trừ tiền từ ví người dùng
    const newBalance = user.balance - book.price;
    const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);

    if (updateError) throw new Error(updateError.message);

    // Ghi chép giao dịch
    const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({ user_id: userId, book_id: bookId, amount: book.price, type: 'purchase' })
        .select()
        .single();

    if (transactionError) throw new Error(transactionError.message);

    return transaction;
};