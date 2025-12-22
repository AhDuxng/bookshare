// File: src/examples/PurchaseBookExample.jsx
// Ví dụ: Component mua sách

import { usePurchaseBook } from '../hooks/useWallet';
import { useUserProfile } from '../hooks/useUser';
import { useState } from 'react';

export function PurchaseBookExample() {
    const token = localStorage.getItem('token');
    const { user } = useUserProfile(token);
    const { purchase, loading, error } = usePurchaseBook();
    const [selectedBookId, setSelectedBookId] = useState(null);

    // Giả sử có danh sách sách để hiển thị
    const sampleBooks = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99 },
        { id: 2, title: 'Sapiens', author: 'Yuval Noah Harari', price: 15.99 },
        { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', price: 20.00 }
    ];

    const handlePurchase = async (bookId) => {
        if (!token) {
            alert('Vui lòng đăng nhập trước');
            return;
        }

        if (!user || user.balance < 20) {
            alert('Số dư không đủ. Vui lòng nạp tiền.');
            return;
        }

        try {
            await purchase(bookId, token);
            alert('Mua sách thành công!');
            setSelectedBookId(null);
        } catch (err) {
            alert('Lỗi mua sách: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Cửa Hàng Sách</h2>

            {user && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <p><strong>Số Dư Ví:</strong> {user.balance}đ</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {sampleBooks.map(book => (
                    <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' }}>
                            Giá: {book.price}đ
                        </p>

                        <button
                            onClick={() => handlePurchase(book.id)}
                            disabled={loading || !token || (user && user.balance < book.price)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: (user && user.balance >= book.price) ? '#27ae60' : '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: (user && user.balance >= book.price && !loading) ? 'pointer' : 'not-allowed',
                                marginTop: '10px'
                            }}
                        >
                            {loading ? 'Đang xử lý...' : 'Mua Ngay'}
                        </button>

                        {user && user.balance < book.price && (
                            <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px' }}>
                                Số dư không đủ
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {error && <p style={{ color: 'red', marginTop: '20px' }}>Lỗi: {error}</p>}
        </div>
    );
}