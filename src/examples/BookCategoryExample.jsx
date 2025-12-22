// File: src/examples/BookCategoryExample.jsx
// Ví dụ: Component hiển thị sách theo danh mục

import { useParams } from 'react-router-dom';
import { useBooksByCategory, useCategories } from '../hooks/useBooks';

export function BookCategoryExample() {
    const { slug } = useParams(); // Lấy slug từ URL: /categories/:slug
    const { books, loading, error } = useBooksByCategory(slug);
    const { categories } = useCategories();

    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh Mục: {slug}</h2>

            {/* Hiển thị danh sách danh mục */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Các Danh Mục:</h3>
                {categories.map(cat => (
                    <a
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        style={{ marginRight: '10px', textDecoration: slug === cat.slug ? 'underline' : 'none' }}
                    >
                        {cat.name}
                    </a>
                ))}
            </div>

            {loading && <p>Đang tải sách...</p>}
            {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <img src={book.image_url} alt={book.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>Giá: {book.price}đ</p>
                    </div>
                ))}
            </div>

            {books.length === 0 && !loading && <p>Không có sách nào trong danh mục này</p>}
        </div>
    );
}