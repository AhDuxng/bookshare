const supabase = require('../supabase');

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