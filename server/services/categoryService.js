const supabase = require('../supabase');

// Lấy danh sách danh mục
exports.getCategories = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) throw new Error(error.message);
    return data;
};