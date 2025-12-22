const bookService = require('../services/bookService');
const axios = require('axios');
const FormData = require('form-data');

// Lấy danh sách sách với tìm kiếm, phân trang, sắp xếp
exports.searchBooks = async (req, res) => {
    try {
        const { query = '', page = 1, limit = 10, sort = 'created_at' } = req.query;
        const result = await bookService.searchBooks(query, page, limit, sort);
        res.json(result);
    } catch (error) {
        console.error('Lỗi searchBooks:', error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách sách theo danh mục
exports.getBooksByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const books = await bookService.getBooksByCategory(slug);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Xóa sách
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        // Kiểm tra sách có tồn tại không
        const book = await bookService.getBookById(id);
        if (!book) {
            return res.status(404).json({ error: 'Không tìm thấy sách' });
        }
        
        // QUAN TRỌNG: Chỉ người đăng bài mới được xóa
        // Nếu không có userId, lấy từ localStorage (tạm thời - nên dùng JWT middleware)
        if (!userId) {
            // Tạm thời cho phép nếu không có auth, nhưng nên implement JWT middleware
            console.warn('⚠️ Cảnh báo: Xóa sách mà không có authentication. Nên implement JWT middleware!');
            // return res.status(401).json({ error: 'Vui lòng đăng nhập để xóa sách' });
        } else if (book.user_id !== userId) {
            // Nếu có userId nhưng không khớp với chủ sở hữu
            return res.status(403).json({ error: 'Bạn không có quyền xóa sách này. Chỉ người đăng bài mới có thể xóa.' });
        }
        
        await bookService.deleteBook(id);
        res.json({ message: 'Đã xóa sách thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        res.status(500).json({ error: error.message });
    }
};
// Lấy danh sách sách theo tác giả
exports.getBooksByAuthor = async (req, res) => {
    try {
        const { name } = req.params;
        const books = await bookService.getBooksByAuthor(name);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng bán sách mới
exports.createBook = async (req, res) => {
    try {
        console.log('\n🔍 DEBUG - Đăng bán sách:');
        console.log('  - req.files:', req.files ? `${req.files.length} files` : 'KHÔNG CÓ FILES');
        console.log('  - req.body.user_id:', req.body.user_id);
        console.log('  - req.body.title:', req.body.title);
        console.log('  - req.body.image_urls:', req.body.image_urls);
        
        const userId = req.user?.id || req.body.user_id; // Từ JWT middleware hoặc body

        // Nếu thiếu userId thì trả lỗi rõ ràng để tránh null constraint ở DB
        if (!userId) {
            return res.status(400).json({ error: 'Thiếu user_id. Vui lòng gửi user_id trong body request.' });
        }
        
        // Validation đầu vào
        const { title, author, price, category_id, description, condition, image_urls } = req.body;
        
        if (!title || !author || !price || !category_id) {
            return res.status(400).json({ 
                error: 'Thiếu thông tin bắt buộc',
                required: ['title', 'author', 'price', 'category_id']
            });
        }

        // Validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: 'Giá phải là số dương' });
        }

        // Lấy ảnh: ưu tiên file upload, fallback image_urls
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            console.log(`📂 Nhận ${req.files.length} file, bắt đầu upload IBYTE...`);
            const files = req.files.slice(0, 5);
            for (const file of files) {
                try {
                    console.log(`   Đang upload: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
                    const form = new FormData();
                    form.append('images[]', file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype
                    });
                    form.append('server', 'server_1');

                    const response = await axios.post('https://cfig.ibytecdn.org/upload', form, {
                        headers: { ...form.getHeaders() },
                        timeout: 30000,
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity
                    });

                    console.log('   📡 IBYTE response:', JSON.stringify(response.data));
                    
                    const url = response?.data?.results?.[0]?.url;
                    if (url) {
                        imageUrls.push(url);
                        console.log('   ✅ Upload thành công:', url);
                    } else {
                        console.error('   ❌ Không nhận URL từ IBYTE:', response.data);
                    }
                } catch (uploadErr) {
                    console.error(`   ❌ Upload lỗi ${file.originalname}:`, uploadErr.response?.data || uploadErr.message);
                }
            }
            console.log(`\n📊 Kết quả upload: ${imageUrls.length}/${files.length} ảnh thành công`);
        }

        // Nếu không có file hoặc upload fail, dùng image_urls từ body (mảng hoặc JSON string)
        if (imageUrls.length === 0 && image_urls) {
            try {
                imageUrls = typeof image_urls === 'string' ? JSON.parse(image_urls) : image_urls;
                console.log('📷 Nhận được', imageUrls.length, 'ảnh từ client (URL):', imageUrls);
            } catch (e) {
                console.error('❌ Lỗi parse image_urls:', e);
                return res.status(400).json({ error: 'image_urls phải là mảng JSON hợp lệ' });
            }
        }

        if (!imageUrls || imageUrls.length === 0) {
            console.error('❌ Không có ảnh nào được upload hoặc cung cấp');
            console.error('  - req.files:', req.files ? `Có ${req.files.length} files nhưng upload thất bại` : 'Không có files');
            console.error('  - image_urls từ body:', image_urls || 'Không có');
            return res.status(400).json({ 
                error: 'Không thể đăng tin - Cần ít nhất 1 ảnh',
                details: {
                    filesReceived: req.files ? req.files.length : 0,
                    filesUploaded: imageUrls.length,
                    reason: req.files && req.files.length > 0 ? 'Upload lên IBYTE CDN thất bại' : 'Không nhận được file ảnh',
                    hint: 'Kiểm tra: 1) Đã chọn ảnh chưa? 2) Field name phải là "images" 3) File phải là ảnh (jpg/png/gif)'
                }
            });
        }

        // Validate URLs format
        const invalidUrls = imageUrls.filter(url => !url || typeof url !== 'string' || !url.startsWith('http'));
        if (invalidUrls.length > 0) {
            console.error('❌ URLs không hợp lệ:', invalidUrls);
            return res.status(400).json({ error: 'Một số URL ảnh không hợp lệ' });
        }

        // Dữ liệu sách
        const parsedUserId = parseInt(userId, 10);
        if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ error: 'user_id không hợp lệ' });
        }

        const bookData = {
            user_id: parsedUserId,
            title: title.trim(),
            author: author.trim(),
            price: parsedPrice,
            category_id: parseInt(category_id),
            description: description?.trim() || null,
            condition: condition || 'good',
            image_url: imageUrls[0] || null, // Ảnh chính
            additional_images: imageUrls.length > 1 ? imageUrls.slice(1) : null // Các ảnh phụ
        };

        console.log('💾 Lưu sách vào database:');
        console.log('  - user_id:', bookData.user_id);
        console.log('  - title:', bookData.title);
        console.log('  - price:', bookData.price);
        console.log('  - category_id:', bookData.category_id);
        console.log('  - Ảnh chính:', bookData.image_url);
        console.log('  - Ảnh phụ:', bookData.additional_images);

        const newBook = await bookService.createBook(bookData);
        
        console.log('✅ Lưu sách thành công! ID:', newBook.id);
        console.log('  - image_url:', newBook.image_url);
        console.log('  - additional_images:', newBook.additional_images);
        
        res.status(201).json({
            message: 'Đăng bán sách thành công!',
            book: newBook
        });
    } catch (error) {
        console.error('Lỗi khi đăng bán sách:', error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy chi tiết 1 cuốn sách
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookService.getBookById(id);
        
        if (!book) {
            return res.status(404).json({ error: 'Không tìm thấy sách' });
        }
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy sách của người dùng
exports.getUserBooks = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.user_id;
        
        if (!userId) {
            return res.status(400).json({ error: 'Thiếu user_id' });
        }
        
        const books = await bookService.getBooksByUserId(userId);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};