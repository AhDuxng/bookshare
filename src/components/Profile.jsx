import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { Button, Badge, StatCard, BookCard, ActionButton } from './common';

// Helpers
const API_BASE = (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || 'http://localhost:3000';
const getToken = () => localStorage.getItem('token');
const currencyVN = (v) =>
  typeof v === 'number' ? `${v.toLocaleString('vi-VN')}đ` : (v ? `${Number(v).toLocaleString('vi-VN')}đ` : '0đ');
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  } catch {
    return iso || '';
  }
};

// Auth headers hook
function useAuthHeaders() {
  const token = useMemo(() => getToken(), []);
  const headers = useMemo(() => ({
    Authorization: token ? `Bearer ${token}` : undefined,
  }), [token]);
  return headers;
}

// useUserProfile: fetch + edit name
function useUserProfile() {
  const headers = useAuthHeaders();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError(null);
    
    // If no token, try localStorage first
    if (!headers.Authorization) {
      console.warn('No authentication token found');
      const localUser = localStorage.getItem('user');
      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing local user:', e);
        }
      }
      
      // Set mock user for demo
      const mockUser = {
        id: 1,
        username: 'demo_user',
        name: 'Người dùng Demo',
        email: 'demo@example.com',
        phone: '0909123456',
        gender: 'male',
        avatar_url: '',
        created_at: new Date().toISOString(),
        joinDate: '2024'
      };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    
    // Always fetch from API when token is available to ensure sync with database
    try {
      console.log('🔄 Fetching user profile from API...');
      const res = await axios.get(`${API_BASE}/api/users/me`, { headers });
      setUser(res.data);
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(res.data));
      console.log('✅ User profile loaded:', res.data.username, 'Avatar:', res.data.avatar_url);
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to localStorage if API fails
      const localUser = localStorage.getItem('user');
      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
          console.log('⚠️ Using cached user from localStorage');
        } catch (e) {
          // Fallback to mock user
          const mockUser = {
            id: 1,
            username: 'demo_user',
            name: 'Người dùng Demo',
            email: 'demo@example.com',
            phone: '0909123456',
            gender: 'male',
            avatar_url: '',
            created_at: new Date().toISOString(),
            joinDate: '2024'
          };
          setUser(mockUser);
        }
      } else {
        // No localStorage, use mock
        const mockUser = {
          id: 1,
          username: 'demo_user',
          name: 'Người dùng Demo',
          email: 'demo@example.com',
          phone: '0909123456',
          gender: 'male',
          avatar_url: '',
          created_at: new Date().toISOString(),
          joinDate: '2024'
        };
        setUser(mockUser);
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const updateName = useCallback(async (name) => {
    try {
      console.log('📝 Updating name:', name);
      console.log('🔐 Auth header:', headers.Authorization ? 'Present' : 'Missing');
      
      if (headers.Authorization) {
        console.log('🌐 Sending PUT /api/users/me');
        const res = await axios.put(`${API_BASE}/api/users/me`, { name }, { headers });
        console.log('✅ API Response:', res.data);
      } else {
        console.log('⚠️ No auth token, saving locally only');
      }
      
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ Name updated and saved to localStorage');
      return true;
    } catch (err) {
      console.error('❌ Error updating name:', err.response?.data || err.message);
      // Still update locally
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 Saved locally as fallback');
      setError(err);
      return true; // Return true anyway since we saved locally
    }
  }, [headers, user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { user, setUser, loading, error, refresh: fetchProfile, updateName };
}

// useAvatarUpload: select + preview + upload multipart → returns URL and updates user
function useAvatarUpload(setUser) {
  const headers = useAuthHeaders();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onSelectFile = useCallback((f) => {
    const image = f?.[0];
    if (!image) return;
    // Validate file
    const valid = ['image/jpeg', 'image/png'];
    if (!valid.includes(image.type)) {
      setError(new Error('Chỉ hỗ trợ jpg/png'));
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      setError(new Error('Kích thước ảnh vượt 5MB'));
      return;
    }
    setError(null);
    setFile(image);
    setPreviewUrl(URL.createObjectURL(image));
  }, []);

  const upload = useCallback(async () => {
    if (!file) {
      console.log('❌ No file selected');
      return null;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      console.log('📤 Starting avatar upload...');
      console.log('🔐 Auth header:', headers.Authorization ? 'Present' : 'Missing');
      console.log('📁 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
      
      if (!headers.Authorization) {
        throw new Error('Vui lòng đăng nhập để upload avatar');
      }
      
      console.log('🌐 Uploading to API:', `${API_BASE}/api/users/me/avatar`);
      
      const form = new FormData();
      form.append('file', file);
      
      console.log('📮 Sending FormData request...');
      const res = await axios.put(`${API_BASE}/api/users/me/avatar`, form, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('✅ API Response:', res.data);
      
      const uploadedUrl = res.data?.avatarUrl || res.data?.user?.avatar_url || res.data?.imageUrl || res.data?.url;
      console.log('🔗 Uploaded CDN URL:', uploadedUrl);
      
      if (!uploadedUrl) {
        throw new Error('Không nhận được URL từ server');
      }

      // Reject non-http(s) URLs to avoid invalid hosts
      if (!/^https?:\/\//.test(uploadedUrl)) {
        throw new Error('URL avatar không hợp lệ từ CDN');
      }
      
      // Fetch lại user từ API để đồng bộ với database
      console.log('🔄 Fetching updated user profile from API...');
      const profileRes = await axios.get(`${API_BASE}/api/users/me`, { headers });
      const updatedUser = profileRes.data;
      
      console.log('💾 Saving updated user to localStorage:', updatedUser);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Debug: Kiểm tra localStorage đã lưu đúng chưa
      const savedUser = JSON.parse(localStorage.getItem('user'));
      console.log('🔍 Verification - User in localStorage:', savedUser);
      console.log('🔍 Verification - avatar_url:', savedUser?.avatar_url);
      
      // Clear preview
      setPreviewUrl('');
      setFile(null);
      
      console.log('✅ Avatar upload complete! CDN URL:', updatedUser.avatar_url);
      
      // Thông báo thành công
      alert('✅ Cập nhật avatar thành công!');
      
      return updatedUser.avatar_url;
    } catch (err) {
      console.error('❌ Upload error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Upload thất bại';
      setError(new Error(errorMsg));
      return null;
    } finally {
      setUploading(false);
    }
  }, [file, headers, setUser]);

  return { file, previewUrl, uploading, error, onSelectFile, upload };
}

// useUserSummary: rating/books/orders/wallet
function useUserSummary() {
  const headers = useAuthHeaders();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true); setError(null);
    
    // Try localStorage first
    const localSummary = localStorage.getItem('userSummary');
    if (localSummary) {
      try {
        const parsed = JSON.parse(localSummary);
        setSummary(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing local summary:', e);
      }
    }
    
    // If no token, use mock summary
    if (!headers.Authorization) {
      const mockSummary = {
        rating: 4.5,
        totalReviews: 10,
        booksSelling: 5,
        ordersBought: 3,
        walletBalance: 250000
      };
      setSummary(mockSummary);
      localStorage.setItem('userSummary', JSON.stringify(mockSummary));
      setLoading(false);
      return;
    }
    
    // Try API call
    try {
      const res = await axios.get(`${API_BASE}/api/users/me/summary`, { headers });
      setSummary(res.data);
      localStorage.setItem('userSummary', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error fetching summary:', err);
      // Fallback to mock summary
      const mockSummary = {
        rating: 4.5,
        totalReviews: 10,
        booksSelling: 5,
        ordersBought: 3,
        walletBalance: 250000
      };
      setSummary(mockSummary);
      localStorage.setItem('userSummary', JSON.stringify(mockSummary));
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  return { summary, loading, error, refresh: fetchSummary };
}

// useTransactions: recent list
function useTransactions(limit = 5) {
  const headers = useAuthHeaders();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null);
    
    // Try localStorage first
    const localTx = localStorage.getItem('userTransactions');
    if (localTx) {
      try {
        const parsed = JSON.parse(localTx);
        setItems(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing local transactions:', e);
      }
    }
    
    // If no token, use mock transactions
    if (!headers.Authorization) {
      const mockTx = [];
      setItems(mockTx);
      setLoading(false);
      return;
    }
    
    // Try API call
    try {
      const res = await axios.get(`${API_BASE}/api/transactions`, { params: { limit }, headers });
      setItems(res.data || []);
      localStorage.setItem('userTransactions', JSON.stringify(res.data || []));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setItems([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [headers, limit]);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  return { items, loading, error, refresh: fetchItems };
}

// useUserBooks: fetch user's selling books
function useUserBooks() {
  const headers = useAuthHeaders();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true); setError(null);
    
    // Get user from localStorage
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      setBooks([]);
      setLoading(false);
      return;
    }
    
    try {
      const user = JSON.parse(localUser);
      // Try API call first to get real data
      try {
        const res = await axios.get(`${API_BASE}/api/users/${user.id}/books`);
        const booksData = res.data || [];
        setBooks(booksData);
        localStorage.setItem('userBooks', JSON.stringify(booksData));
        setLoading(false);
        return;
      } catch (apiErr) {
        console.error('API error, trying localStorage:', apiErr);
      }
      
      // Fallback to localStorage if API fails
      const localBooks = localStorage.getItem('userBooks');
      if (localBooks) {
        try {
          const parsed = JSON.parse(localBooks);
          setBooks(parsed);
        } catch (e) {
          console.error('Error parsing local books:', e);
          setBooks([]);
        }
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Error fetching user books:', err);
      setBooks([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const deleteBook = useCallback(async (bookId) => {
    try {
      await axios.delete(`${API_BASE}/api/books/${bookId}`, { headers });
      // Refresh books after deletion
      await fetchBooks();
      return { success: true };
    } catch (err) {
      console.error('Error deleting book:', err);
      return { success: false, error: err.message };
    }
  }, [headers, fetchBooks]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  return { books, loading, error, refresh: fetchBooks, deleteBook };
}

// Editable Name component
function EditableName({ name, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setValue(name || ''); }, [name]);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true); setError(null);
    const ok = await onSave(value.trim());
    setSaving(false);
    if (ok) setEditing(false); else setError(new Error('Không thể lưu tên'));
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold truncate text-slate-900 dark:text-white">{name}</h1>
        <Button variant="outline" onClick={() => setEditing(true)}>Chỉnh sửa</Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded px-2 py-1"
        placeholder="Nhập tên"
      />
      <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
      <Button variant="outline" onClick={() => { setEditing(false); setValue(name || ''); }}>Huỷ</Button>
      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </div>
  );
}

// Avatar card component
function AvatarCard({ user, isOwner, onSelectFile, previewUrl, uploading, onUpload, uploadError }) {
  // Chỉ dùng avatar_url hợp lệ từ CDN (http/https), tránh host sai gây DNS lỗi
  const safeAvatar = user?.avatar_url && /^https?:\/\//.test(user.avatar_url) ? user.avatar_url : null;
  const avatarUrl = previewUrl || safeAvatar || null;
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 rounded-t-2xl -z-10"></div>
      
      <div className="flex flex-col items-center text-center gap-3 mt-4 pt-6">
        <div className="relative group/avatar">
          <div className="rounded-full size-24 border-4 border-white dark:border-surface-dark shadow-md overflow-hidden bg-slate-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          
          {/* Online Status */}
          <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white dark:border-surface-dark size-4 rounded-full"></div>

          {/* Edit Avatar Overlay */}
          {isOwner && (
            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">photo_camera</span>
              <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={(e) => onSelectFile(e.target.files)} />
            </label>
          )}
        </div>

        {isOwner && previewUrl && (
          <Button variant="primary" size="sm" onClick={onUpload} disabled={uploading} className="mt-2">
            {uploading ? 'Đang tải...' : 'Lưu ảnh'}
          </Button>
        )}
        {uploadError && (
          <p className="text-red-500 text-xs mt-1">{uploadError.message}</p>
        )}
      </div>
    </div>
  );
}

// Recent transactions list
function RecentTransactions({ items, loading }) {
  if (loading) {
    return (
      <div className="p-4">Đang tải giao dịch...</div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className="p-4 text-slate-500">Chưa có giao dịch gần đây.</div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase">
          <tr>
            <th className="px-6 py-3">Mã đơn</th>
            <th className="px-6 py-3">Sách</th>
            <th className="px-6 py-3">Ngày</th>
            <th className="px-6 py-3">Trạng thái</th>
            <th className="px-6 py-3 text-right">Tổng tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((t, idx) => (
            <tr key={idx}>
              <td className="px-6 py-3 font-mono text-xs">{t.id || t.orderId}</td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-slate-200 overflow-hidden">
                    {t.bookImage && <img src={t.bookImage} alt={t.bookTitle} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <div className="font-semibold">{t.bookTitle}</div>
                    {t.bookCategory && <div className="text-xs text-slate-500">{t.bookCategory}</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-3 text-slate-600">{formatDate(t.date || t.created_at)}</td>
              <td className="px-6 py-3">
                <Badge variant={t.status === 'Hoàn thành' || t.status === 'delivered' ? 'success' : t.status === 'cancelled' ? 'danger' : 'info'}>
                  {t.status || t.statusText || 'Đang xử lý'}
                </Badge>
              </td>
              <td className="px-6 py-3 text-right font-bold">{currencyVN(t.total || t.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Profile() {
  // Owner mode: true when viewing own dashboard
  const [isOwner] = useState(true);

  // Hooks
  const { user, setUser, loading: profileLoading, updateName } = useUserProfile();
  const { summary, loading: summaryLoading } = useUserSummary();
  const { items: transactions, loading: txLoading } = useTransactions(5);
  const { books, loading: booksLoading, deleteBook, refresh: refreshBooks } = useUserBooks();
  const [deletingBookId, setDeletingBookId] = useState(null);

  // Auto refresh books when navigating back from add-book page
  useEffect(() => {
    const handleFocus = () => {
      refreshBooks();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshBooks]);

  // Helper to check if current user owns the book
  const isBookOwner = useCallback((book) => {
    if (!user || !book) return false;
    return book.user_id === user.id;
  }, [user]);

  const handleDeleteBook = useCallback(async (bookId, bookTitle, book) => {
    // Kiểm tra quyền sở hữu trước khi xóa
    if (!isBookOwner(book)) {
      alert('❌ Bạn không có quyền xóa sách này. Chỉ người đăng bài mới có thể xóa.');
      return;
    }
    
    if (!window.confirm(`Bạn có chắc chắn muốn gỡ sách "${bookTitle}"?`)) {
      return;
    }
    
    setDeletingBookId(bookId);
    const result = await deleteBook(bookId);
    setDeletingBookId(null);
    
    if (result.success) {
      alert('✅ Đã gỡ sách thành công!');
    } else {
      // Hiển thị lỗi chi tiết từ backend
      const errorMsg = result.error || 'Lỗi không xác định';
      if (errorMsg.includes('không có quyền') || errorMsg.includes('403')) {
        alert('❌ Bạn không có quyền xóa sách này. Chỉ người đăng bài mới có thể xóa.');
      } else if (errorMsg.includes('không tìm thấy') || errorMsg.includes('404')) {
        alert('❌ Không tìm thấy sách này.');
      } else {
        alert('❌ Không thể gỡ sách: ' + errorMsg);
      }
    }
  }, [deleteBook, isBookOwner]);
  const { previewUrl, uploading, onSelectFile, upload, error: uploadError } = useAvatarUpload(setUser);

  const ratingValue = summary?.rating ?? 0;
  const totalReviews = summary?.totalReviews ?? 0;
  const booksSelling = summary?.booksSelling ?? 0;
  const ordersBought = summary?.ordersBought ?? 0;
  const walletBalance = summary?.walletBalance ?? 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
            {/* User Profile Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
              {profileLoading ? (
                <div className="p-6">Đang tải hồ sơ...</div>
              ) : user ? (
                <>
                  <AvatarCard 
                    user={user} 
                    isOwner={isOwner} 
                    onSelectFile={onSelectFile} 
                    previewUrl={previewUrl} 
                    uploading={uploading} 
                    onUpload={upload}
                    uploadError={uploadError}
                  />
                  <div className="px-6 pb-6">
                    <div className="flex flex-col overflow-hidden w-full">
                      <h1 className="text-xl font-bold truncate text-slate-900 dark:text-white text-center">{user.name || user.username || user.email}</h1>
                      <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-1">
                        Thành viên từ {user.created_at ? new Date(user.created_at).getFullYear() : (user.joinDate || '2025')}
                      </p>
                      
                      <div className="flex items-center justify-center gap-1.5 mt-3 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800/30 w-fit mx-auto">
                        <span className="material-symbols-outlined text-[18px] fill-current text-amber-500">star</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-amber-100">{summary?.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-xs text-slate-400">/ 5.0</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6">Không thể tải hồ sơ người dùng.</div>
              )}
            </div>

            {/* Navigation Menu */}
            {isOwner && (
              <nav className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800/60 overflow-hidden py-3 flex flex-col gap-1">
                <Link to="/profile" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl bg-primary-light dark:bg-primary/10 text-primary-dark dark:text-primary font-semibold transition-all">
                  <span className="material-symbols-outlined">dashboard</span>
                  <p className="text-sm">Tổng quan</p>
                </Link>
                <Link to="/profile/detail" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all group">
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">person</span>
                  <p className="font-medium text-sm">Thông tin cá nhân</p>
                </Link>
                <Link to="/profile/my-books" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all group">
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">menu_book</span>
                  <p className="font-medium text-sm">Sách đang bán</p>
                  {booksSelling > 0 && (
                    <span className="ml-auto bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                      {booksSelling}
                    </span>
                  )}
                </Link>
                <Link to="/profile/orders" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all group">
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">shopping_bag</span>
                  <p className="font-medium text-sm">Lịch sử mua hàng</p>
                </Link>
                <Link to="/profile/wallet" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all group">
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">account_balance_wallet</span>
                  <p className="font-medium text-sm">Ví của tôi</p>
                </Link>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-6"></div>
                <Link to="/login" className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all group">
                  <span className="material-symbols-outlined group-hover:text-red-500 transition-colors">logout</span>
                  <p className="font-medium text-sm">Đăng xuất</p>
                </Link>
              </nav>
            )}
          </aside>

          {/* Main */}
          <section className="flex-1 flex flex-col gap-8 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isOwner ? "Tổng quan tài khoản" : "Hồ sơ người bán"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  {isOwner ? "Chào mừng trở lại, đây là hoạt động gần đây của bạn." : "Xem thông tin và các sách đang bán."}
                </p>
              </div>
              
              {isOwner && (
                <div className="flex gap-3">
                  <Link to="/profile/detail">
                    <Button variant="outline">
                      Chỉnh sửa hồ sơ
                    </Button>
                  </Link>
                  <Button variant="primary">
                    Nạp tiền
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon="star"
                iconColor="amber"
                title="Đánh giá uy tín"
                value={ratingValue}
                suffix="/5"
                badge={`${totalReviews} lượt đánh giá`}
                badgeVariant="info"
              />
              <StatCard
                icon="library_books"
                iconColor="blue"
                title="Sách đang bán"
                value={booksSelling}
              />
              <StatCard
                icon="shopping_cart"
                iconColor="green"
                title="Đơn hàng đã mua"
                value={ordersBought}
              />
              <StatCard
                icon="account_balance_wallet"
                title="Số dư ví"
                value={currencyVN(walletBalance)}
                highlight={true}
              />
              {summaryLoading && <div className="col-span-4 text-sm text-slate-500">Đang tải số liệu...</div>}
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl border bg-white dark:bg-surface-dark">
              <div className="px-6 py-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  <h3 className="text-lg font-bold">Giao dịch gần đây</h3>
                </div>
                <Link to="/profile/orders" className="text-primary text-sm font-semibold">Xem tất cả</Link>
              </div>
              <RecentTransactions items={transactions} loading={txLoading} />
            </div>

            {/* Selling Books Section */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-1 border-l-4 border-primary pl-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sách đang bán nổi bật</h3>
                <Link to="/profile/my-books" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                  Xem tất cả <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
              
              {booksLoading ? (
                <div className="text-center py-8 text-slate-500">Đang tải sách...</div>
              ) : books.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-2xl border">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">book</span>
                  <p className="text-slate-500 dark:text-slate-400 mb-2">Bạn chưa đăng sách nào</p>
                  <Link to="/add-book">
                    <Button variant="primary">Đăng tin bán sách</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.slice(0, 6).map(book => (
                    <div key={book.id} className="relative">
                      {deletingBookId === book.id && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Đang gỡ...</p>
                          </div>
                        </div>
                      )}
                      <BookCard 
                        id={book.id}
                        title={book.title}
                        author={book.author || book.publisher}
                        price={`${book.price?.toLocaleString('vi-VN')}đ` || book.price}
                        image={book.image_url || book.image}
                        category={book.category}
                        condition={book.condition}
                        conditionColor="white"
                        overlayBadge={book.condition}
                        overlayBadgeColor="white"
                        actionButtons={isOwner && isBookOwner(book) && (
                          <>
                            <ActionButton 
                              icon="delete" 
                              variant="delete" 
                              tooltip="Gỡ bài" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteBook(book.id, book.title, book);
                              }}
                              disabled={deletingBookId === book.id}
                            />
                            <ActionButton 
                              icon="edit" 
                              variant="edit" 
                              tooltip="Chỉnh sửa"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/edit-book/${book.id}`;
                              }}
                            />
                          </>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;