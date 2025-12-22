import React, { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { StatusBadge, Pagination, Button, ActionButton, TabButton } from './common';

const API_BASE = 'http://localhost:3000';
const getToken = () => localStorage.getItem('token');

// Format date helper
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

// useUserProfile hook
function useUserProfile() {
  const headers = useAuthHeaders();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    
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
    
    if (!headers.Authorization) {
      const mockUser = {
        id: 1,
        username: 'demo_user',
        name: 'Người dùng Demo',
        avatar_url: ''
      };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, { headers });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error fetching profile:', err);
      const localUser = localStorage.getItem('user');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);
  return { user, loading };
}

// useUserBooks hook
function useUserBooks() {
  const headers = useAuthHeaders();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      setBooks([]);
      setLoading(false);
      return;
    }
    
    try {
      const user = JSON.parse(localUser);
      try {
        const res = await axios.get(`${API_BASE}/api/users/${user.id}/books`);
        const booksData = res.data || [];
        setBooks(booksData);
        localStorage.setItem('userBooks', JSON.stringify(booksData));
      } catch (apiErr) {
        console.error('API error, trying localStorage:', apiErr);
        const localBooks = localStorage.getItem('userBooks');
        if (localBooks) {
          setBooks(JSON.parse(localBooks));
        } else {
          setBooks([]);
        }
      }
    } catch (err) {
      console.error('Error fetching user books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const deleteBook = useCallback(async (bookId) => {
    try {
      await axios.delete(`${API_BASE}/api/books/${bookId}`, { headers });
      await fetchBooks();
      return { success: true };
    } catch (err) {
      console.error('Error deleting book:', err);
      return { success: false, error: err.message };
    }
  }, [headers, fetchBooks]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  return { books, loading, refresh: fetchBooks, deleteBook };
}

const BookRow = ({ book, onDelete, isDeleting }) => {
  const handleDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      const result = await onDelete(book.id);
      if (result.success) {
        alert('✅ Đã xóa sách thành công!');
      } else {
        alert('❌ Không thể xóa sách: ' + (result.error || 'Lỗi không xác định'));
      }
    }
  };

  const getStatusInfo = (status) => {
    if (status === 'sold') return { text: 'Đã bán', status: 'sold' };
    if (status === 'pending') return { text: 'Chờ duyệt', status: 'pending' };
    return { text: 'Đang hiển thị', status: 'active' };
  };

  const statusInfo = getStatusInfo(book.status);
  const imageUrl = book.image_url || book.image || 'https://via.placeholder.com/100x150?text=No+Image';
  const price = typeof book.price === 'number' ? `${book.price.toLocaleString('vi-VN')}đ` : book.price;
  
  return (
    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-slate-200 dark:border-gray-700 last:border-none">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div 
            className={`h-16 w-12 shrink-0 rounded bg-gray-200 dark:bg-gray-700 bg-cover bg-center shadow-sm ${book.status === 'sold' ? 'grayscale opacity-75' : ''}`} 
            style={{backgroundImage: `url("${imageUrl}")`}}
          ></div>
          <div className="flex flex-col gap-1">
            <p className={`text-slate-900 dark:text-white text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors cursor-pointer ${book.status === 'sold' ? 'text-slate-500' : ''}`}>
              {book.title}
            </p>
            <p className="text-slate-500 dark:text-gray-400 text-xs">{book.categories?.name || book.category || 'Khác'}</p>
            <div className="flex mt-1">
              <StatusBadge status={statusInfo.status} text={statusInfo.text} />
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className={`text-slate-900 dark:text-white text-sm font-bold ${book.status === 'sold' ? 'text-slate-500' : ''}`}>{price}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-slate-900 dark:text-gray-300 text-sm">{book.condition || 'Khá tốt'}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-slate-500 dark:text-gray-400 text-sm">{formatDate(book.created_at)}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {book.status === 'sold' ? (
             <ActionButton icon="refresh" variant="default" tooltip="Đăng lại" />
          ) : (
            <>
                <ActionButton 
                  icon="edit" 
                  variant="edit" 
                  tooltip="Chỉnh sửa"
                  onClick={() => window.location.href = `/edit-book/${book.id}`}
                />
                <ActionButton icon="check_circle" variant="approve" tooltip="Đánh dấu đã bán" />
            </>
          )}
          <ActionButton 
            icon="delete" 
            variant="delete" 
            tooltip="Xóa"
            onClick={handleDelete}
            disabled={isDeleting}
          />
        </div>
      </td>
    </tr>
  );
};

function MyBooks() {
  const { user, loading: userLoading } = useUserProfile();
  const { books, loading: booksLoading, deleteBook } = useUserBooks();
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDeleteBook = useCallback(async (bookId) => {
    setDeletingBookId(bookId);
    const result = await deleteBook(bookId);
    setDeletingBookId(null);
    return result;
  }, [deleteBook]);

  const filteredBooks = useMemo(() => {
    if (filterStatus === 'all') return books;
    if (filterStatus === 'active') return books.filter(b => b.status === 'available' || !b.status);
    if (filterStatus === 'sold') return books.filter(b => b.status === 'sold');
    if (filterStatus === 'pending') return books.filter(b => b.status === 'pending');
    return books;
  }, [books, filterStatus]);

  const getAvatarUrl = () => {
    if (user?.avatar_url) return user.avatar_url;
    if (user?.avatar) return user.avatar;
    return 'https://via.placeholder.com/48?text=' + ((user?.name?.[0] || user?.username?.[0] || 'U').toUpperCase());
  };

  const getUserName = () => {
    return user?.name || user?.username || 'Người dùng';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (Reused structure from Profile) */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                  {userLoading ? (
                    <div className="size-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm" style={{backgroundImage: `url("${getAvatarUrl()}")`}}></div>
                  )}
                  <div className="flex flex-col">
                    <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                      {userLoading ? 'Loading...' : getUserName()}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Thành viên tích cực</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  <Link to="/profile/detail" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">person</span>
                    <span className="text-sm font-medium">Hồ sơ cá nhân</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">settings</span>
                    <span className="text-sm font-medium">Cài đặt tài khoản</span>
                  </Link>
                  <Link to="/profile/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">receipt_long</span>
                    <span className="text-sm font-medium">Lịch sử mua hàng</span>
                  </Link>
                  <Link to="/profile/my-books" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-white font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-primary dark:text-white">storefront</span>
                    <span className="text-sm">Sách đang bán</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">notifications</span>
                    <span className="text-sm font-medium">Thông báo</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Page Heading */}
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Sách đang bán của tôi</h1>
                <p className="text-slate-500 dark:text-gray-400 text-base">Quản lý danh sách các cuốn sách bạn đang rao bán trên sàn</p>
              </div>
              <Link to="/add-book">
                <Button icon="add_circle">Đăng bán sách mới</Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto overflow-x-auto no-scrollbar w-full sm:w-auto">
                <TabButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>
                    Tất cả ({books.length})
                </TabButton>
                <TabButton active={filterStatus === 'active'} onClick={() => setFilterStatus('active')}>
                    Đang hiển thị ({books.filter(b => b.status === 'available' || !b.status).length})
                </TabButton>
                <TabButton active={filterStatus === 'sold'} onClick={() => setFilterStatus('sold')}>
                    Đã bán ({books.filter(b => b.status === 'sold').length})
                </TabButton>
                <TabButton active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')}>
                    Chờ duyệt ({books.filter(b => b.status === 'pending').length})
                </TabButton>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-slate-500 dark:text-gray-500 whitespace-nowrap hidden sm:block">Sắp xếp:</span>
                <select className="form-select bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-gray-200 py-1.5 px-3 focus:ring-primary focus:border-primary w-full sm:w-40">
                    <option>Mới nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {/* Table List */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Sản phẩm</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Giá bán</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Tình trạng</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Ngày đăng</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {booksLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            <p className="text-slate-500 dark:text-slate-400">Đang tải sách...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">book</span>
                            <p className="text-slate-500 dark:text-slate-400">Không có sách nào</p>
                            <Link to="/add-book">
                              <Button icon="add_circle">Đăng bán sách mới</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map(book => (
                        <BookRow 
                          key={book.id} 
                          book={book}
                          onDelete={handleDeleteBook}
                          isDeleting={deletingBookId === book.id}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyBooks;