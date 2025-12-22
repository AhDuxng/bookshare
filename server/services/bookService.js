const supabase = require('../supabase');

// Tìm kiếm sách với phân trang và sắp xếp
exports.searchBooks = async (query, page, limit, sort) => {
    const offset = (page - 1) * limit;
    let dbQuery = supabase
        .from('books')
        .select('id, title, author, price, description, condition, image_url, additional_images, created_at, status, categories(name, slug), users(username, avatar_url)')
        .eq('status', 'available'); // Chỉ lấy sách đang available

    // Nếu có query search
    if (query && query.trim()) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%`);
    }

    // Sắp xếp - nếu sort là created_at thì descending để lấy mới nhất
    const ascending = sort === 'created_at' ? false : true;
    dbQuery = dbQuery.order(sort, { ascending });

    // Phân trang
    const { data, error } = await dbQuery.range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    console.log(`📚 Trả về ${data?.length || 0} sách (có ${data?.filter(b => b.image_url).length || 0} sách có ảnh)`);
    return { books: data, total: data.length };
};

// Lấy sách theo danh mục
exports.getBooksByCategory = async (slug) => {
    // Tìm category_id từ slug
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();
    
    if (!category) throw new Error('Danh mục không tồn tại');

    const { data, error } = await supabase
        .from('books')
        .select('id, title, author, price, description, condition, image_url, additional_images, created_at, status, categories(name, slug), users(username, avatar_url)')
        .eq('category_id', category.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

// Lấy sách theo tác giả
exports.getBooksByAuthor = async (name) => {
    const { data, error } = await supabase
        .from('books')
        .select('*, categories(name), users(username)')
        .ilike('author', `%${name}%`);

    if (error) throw new Error(error.message);
    return data;
};

// Tạo sách mới
exports.createBook = async (bookData) => {
    const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select('*, categories(name, slug), users(username)')
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// Lấy sách theo ID
exports.getBookById = async (bookId) => {
    const { data, error } = await supabase
        .from('books')
        .select('id, title, author, price, description, condition, image_url, additional_images, created_at, status, category_id, user_id, categories(name, slug), users(username, email, avatar_url)')
        .eq('id', bookId)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// Lấy sách của người dùng
exports.getBooksByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('books')
        .select('*, categories(name, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

// Xóa sách
exports.deleteBook = async (bookId) => {
    const { data, error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};