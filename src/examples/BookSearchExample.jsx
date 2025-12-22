// File: src/examples/BookSearchExample.jsx
// Ví dụ: Component tìm kiếm sách

import { useState } from 'react';
import { useSearchBooks } from '../hooks/useBooks';

export function BookSearchExample() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const { books, loading, error } = useSearchBooks(searchQuery, page);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset về trang 1 khi tìm kiếm mới
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tìm Kiếm Sách</h2>
            
            <input
                type="text"
                placeholder="Nhập tên sách hoặc tác giả..."
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            />

            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p>Giá: {book.price}đ</p>
                    </div>
                ))}
            </div>

            {books.length === 0 && !loading && searchQuery && <p>Không tìm thấy sách nào</p>}
        </div>
    );
}