// File: src/examples/integration-guide.md
// Hướng dẫn tích hợp React với Backend API

# React Integration Guide - BookShare Backend

## 📌 Cách Sử Dụng Hooks

### 1. Tìm Kiếm Sách (Search)

```jsx
import { useSearchBooks } from '../hooks/useBooks';

function MyComponent() {
    const [query, setQuery] = useState('Harry');
    const { books, loading, error } = useSearchBooks(query, 1, 10);

    return (
        <div>
            {loading && <p>Đang tải...</p>}
            {error && <p>Lỗi: {error}</p>}
            {books.map(book => (
                <div key={book.id}>{book.title}</div>
            ))}
        </div>
    );
}
```

### 2. Lấy Danh Mục

```jsx
import { useCategories } from '../hooks/useBooks';

function CategoriesComponent() {
    const { categories, loading, error } = useCategories();

    return (
        <div>
            {categories.map(cat => (
                <button key={cat.id}>{cat.name}</button>
            ))}
        </div>
    );
}
```

### 3. Lấy Sách Theo Danh Mục

```jsx
import { useParams } from 'react-router-dom';
import { useBooksByCategory } from '../hooks/useBooks';

function CategoryPage() {
    const { slug } = useParams(); // URL: /categories/fiction
    const { books, loading } = useBooksByCategory(slug);

    return <div>{/* hiển thị sách */}</div>;
}
```

### 4. Lấy Sách Theo Tác Giả

```jsx
import { useBooksByAuthor } from '../hooks/useBooks';

function AuthorPage() {
    const { books } = useBooksByAuthor('Paulo Coelho');

    return <div>{/* hiển thị sách */}</div>;
}
```

### 5. Lấy Hồ Sơ Người Dùng

```jsx
import { useUserProfile } from '../hooks/useUser';

function ProfileComponent() {
    const token = localStorage.getItem('token');
    const { user, loading, error } = useUserProfile(token);

    return (
        <div>
            {user && (
                <div>
                    <p>Tên: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Số Dư: {user.balance}đ</p>
                </div>
            )}
        </div>
    );
}
```

### 6. Upload Avatar

```jsx
import { useUploadAvatar } from '../hooks/useUser';
import { useState } from 'react';

function AvatarUpload() {
    const [file, setFile] = useState(null);
    const { uploadAvatar, loading } = useUploadAvatar();
    const token = localStorage.getItem('token');

    const handleUpload = async () => {
        try {
            await uploadAvatar(file, token);
            alert('Thành công!');
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
```

### 7. Đăng Ký & Đăng Nhập

```jsx
import { useRegister, useLogin } from '../hooks/useUser';

function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useLogin();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.token);
            // Redirect to home
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Tên đăng nhập"
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mật khẩu"
            />
            <button disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
```

### 8. Nạp Tiền Vào Ví

```jsx
import { useTopupWallet } from '../hooks/useWallet';
import { useState } from 'react';

function TopupComponent() {
    const [amount, setAmount] = useState('');
    const { topup, loading } = useTopupWallet();
    const token = localStorage.getItem('token');

    const handleTopup = async () => {
        try {
            await topup(parseInt(amount), token);
            alert('Nạp tiền thành công!');
            setAmount('');
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    return (
        <div>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
            />
            <button onClick={handleTopup} disabled={loading}>
                {loading ? 'Đang nạp...' : 'Nạp Tiền'}
            </button>
        </div>
    );
}
```

### 9. Lấy Lịch Sử Giao Dịch

```jsx
import { useTransactionHistory } from '../hooks/useWallet';

function TransactionHistoryComponent() {
    const token = localStorage.getItem('token');
    const { transactions, loading } = useTransactionHistory(token);

    return (
        <div>
            <h2>Lịch Sử Giao Dịch</h2>
            {transactions.map(trans => (
                <div key={trans.id}>
                    <p>{trans.type === 'topup' ? 'Nạp tiền' : 'Mua sách'}: {trans.amount}đ</p>
                    <p>{new Date(trans.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
            ))}
        </div>
    );
}
```

### 10. Mua Sách

```jsx
import { usePurchaseBook } from '../hooks/useWallet';

function BuyBookComponent({ bookId, bookPrice }) {
    const { purchase, loading, error } = usePurchaseBook();
    const token = localStorage.getItem('token');

    const handleBuy = async () => {
        try {
            await purchase(bookId, token);
            alert('Mua sách thành công!');
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    return (
        <div>
            <button onClick={handleBuy} disabled={loading}>
                {loading ? 'Đang mua...' : `Mua (${bookPrice}đ)`}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
```

## 🔑 Quản Lý Token (JWT)

Lưu token sau khi đăng nhập:

```jsx
const res = await login(username, password);
localStorage.setItem('token', res.user.token); // Hoặc từ API trả về
```

Sử dụng token trong requests:

```jsx
const token = localStorage.getItem('token');
// Truyền vào hooks hoặc axios headers
```

Đăng xuất:

```jsx
localStorage.removeItem('token');
// Redirect to login
```

## 📋 Checklist

- [ ] Đã cài đặt axios trong `package.json`
- [ ] Đã tạo thư mục `src/hooks/`
- [ ] Đã tạo hooks cho books, users, wallet
- [ ] Đã tạo components ví dụ
- [ ] Đã test API endpoints bằng Postman
- [ ] Đã kết nối frontend với backend
- [ ] Đã xử lý errors và loading states
- [ ] Đã lưu/lấy token từ localStorage

---

**Made with ❤️ for BookShare**