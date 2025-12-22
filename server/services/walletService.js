const supabase = require('../supabase');

// Nạp tiền vào ví
exports.topupWallet = async (userId, amount) => {
    // Cập nhật balance trong users
    const { error: updateError } = await supabase
        .from('users')
        .update({ balance: supabase.rpc('add_balance', { user_id: userId, add_amount: amount }) })
        .eq('id', userId);

    if (updateError) throw new Error(updateError.message);

    // Tạo ghi chép giao dịch
    const { data, error } = await supabase
        .from('transactions')
        .insert({ user_id: userId, amount, type: 'topup' })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// Lấy lịch sử giao dịch
exports.getTransactionHistory = async (userId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};