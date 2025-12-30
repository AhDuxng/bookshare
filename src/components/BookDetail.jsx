import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { BookCard, Button, IconBox, Badge, ActionButton, UserCard, InfoCard } from './common';

const API_BASE = 'http://localhost:3000';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  // Fetch book data from API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/books/${id}`);
        const bookData = response.data;
        
        // Combine image_url and additional_images into one array
        const images = [
          bookData.image_url,
          ...(bookData.additional_images || [])
        ].filter(Boolean);
        
        setBook({
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          price: `${Number(bookData.price).toLocaleString()}đ`,
          condition: bookData.condition || 'good',
          description: bookData.description || 'Chưa có mô tả chi tiết.',
          images: images.length > 0 ? images : ['https://via.placeholder.com/400x600?text=No+Image'],
          seller: bookData.users ? {
            name: bookData.users.username || 'Người dùng',
            avatar: bookData.users.avatar_url || null,
            email: bookData.users.email
          } : {
            name: 'Người dùng',
            avatar: null
          },
          category: bookData.categories ? bookData.categories.name : 'Khác',
          categorySlug: bookData.categories ? bookData.categories.slug : 'other',
          created_at: bookData.created_at,
          status: bookData.status
        });
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải thông tin sách:', err);
        setError('Không thể tải thông tin sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch related books in the same category
  useEffect(() => {
    if (!book?.categorySlug) return;

    const fetchRelatedBooks = async () => {
      setLoadingRelated(true);
      try {
        const response = await axios.get(`${API_BASE}/api/categories/${book.categorySlug}/books`);
        const booksData = response.data || [];
        
        // Filter out current book and limit to 5 items
        const filtered = booksData
          .filter(b => b.id !== parseInt(id))
          .slice(0, 5)
          .map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: b.price ? `${Number(b.price).toLocaleString()}đ` : 'Liên hệ',
            image: b.image_url,
            condition: b.condition || 'good',
            user: b.users ? {
              name: b.users.username,
              avatar: b.users.avatar_url
            } : null
          }));
        
        setRelatedBooks(filtered);
      } catch (err) {
        console.error('Lỗi khi tải sách liên quan:', err);
        setRelatedBooks([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedBooks();
  }, [book?.categorySlug, id]);

  const handleAddToCart = async () => {
    if (!book) return;
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      alert('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }

    setAddingCart(true);
    try {
      await axios.post(`${API_BASE}/api/cart`, {
        user_id: user.id,
        book_id: book.id,
        quantity: 1
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      alert('Đã thêm vào giỏ hàng');
    } catch (err) {
      console.error('Lỗi thêm giỏ hàng:', err.response?.data || err.message);
      const status = err.response?.status;
      const data = err.response?.data;
      const msg = data?.error || data?.message || err.message || 'Không thể thêm vào giỏ hàng';
      const detail = typeof data === 'object' ? JSON.stringify(data) : String(data || '');

      if (status === 401 || msg.toLowerCase().includes('jwt expired')) {
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      // Nếu thiếu thông tin, hiển thị cả chi tiết trả về từ server
      alert(`${msg}${detail && detail !== msg ? `\n${detail}` : ''}`);
    } finally {
      setAddingCart(false);
    }
  };


  // Loading state
  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-[#f8f9fc] flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Đang tải thông tin sách...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-[#f8f9fc] flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[48px] text-red-500">error</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy sách</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{error || 'Sách này không tồn tại hoặc đã bị xóa.'}</p>
            <Link 
              to="/browse"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Quay lại danh sách
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-[#f8f9fc] flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white dark:bg-gray-800/50 py-3 px-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
          <Link to="/" className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            Trang chủ
          </Link>
          <span className="text-gray-300 dark:text-gray-600 text-sm font-medium leading-normal">/</span>
          <Link to="/browse" className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors">Danh mục</Link>
          <span className="text-gray-300 dark:text-gray-600 text-sm font-medium leading-normal">/</span>
          <span className="text-primary font-bold text-sm leading-normal bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{book.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24 h-fit">
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center relative group shadow-soft">
              <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-yellow-600 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span>
                {book.condition}
              </div>
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={book.title} 
                src={book.images[0]} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {book.images.map((img, index) => (
                <div key={index} className={`aspect-square rounded-xl border overflow-hidden cursor-pointer transition-all ${index === 0 ? 'border-2 border-primary ring-2 ring-blue-100 dark:ring-blue-900' : 'border-gray-200 dark:border-gray-700 hover:border-primary'}`}>
                  <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" alt={`Thumbnail ${index}`} src={img} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h1 className="text-text-main dark:text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight">
                {book.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-text-secondary dark:text-gray-400 text-sm font-medium border-y border-gray-100 dark:border-gray-800 py-4">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-primary">person</span> Tác giả: <span className="text-text-main dark:text-gray-200 font-bold hover:text-primary cursor-pointer transition-colors">{book.author}</span></span>
                <span className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-gray-400">category</span> {book.category}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="z-10">
                <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">Giá bán hiện tại</p>
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-bold text-primary tracking-tight">{book.price}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 z-10">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 text-sm font-bold border border-green-200 dark:border-green-800 shadow-sm">
                  <span className="material-symbols-outlined text-[18px] mr-1.5 filled">check_circle</span>
                  Tình trạng: {book.condition}
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <UserCard
              name={book.seller.name}
              avatar={book.seller.avatar}
              rating={book.seller.rating}
              responseTime={book.seller.response}
              badge="success"
              badgeText="Đã xác thực"
              link="#"
              action={
                <Button variant="outline" size="sm" className="w-full">
                  Nhắn tin
                </Button>
              }
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                className="flex-1 h-14 text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0" 
                icon="shopping_cart_checkout"
                onClick={handleAddToCart}
                disabled={addingCart}
              >
                {addingCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </Button>
              <Button variant="outline" className="flex-1 h-14 text-lg border-2 hover:border-gray-300 dark:hover:border-gray-500" icon="chat_bubble">
                Chat ngay
              </Button>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main dark:text-white">Giao hàng nhanh</p>
                  <p className="text-xs text-text-secondary dark:text-gray-400">2-3 ngày làm việc</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main dark:text-white">Đảm bảo hoàn tiền</p>
                  <p className="text-xs text-text-secondary dark:text-gray-400">Trong 3 ngày nhận hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              <button className="flex items-center justify-center border-b-[3px] border-primary text-primary font-bold pb-4 px-2 min-w-fit cursor-pointer transition-colors">
                <span className="mr-2 material-symbols-outlined text-[20px]">description</span>
                Mô tả chi tiết
              </button>
              <button className="flex items-center justify-center border-b-[3px] border-transparent text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary pb-4 px-2 min-w-fit cursor-pointer transition-colors">
                <span className="mr-2 material-symbols-outlined text-[20px]">info</span>
                Thông tin sách
              </button>
              <button className="flex items-center justify-center border-b-[3px] border-transparent text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary pb-4 px-2 min-w-fit cursor-pointer transition-colors">
                <span className="mr-2 material-symbols-outlined text-[20px]">reviews</span>
                Đánh giá (12)
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 text-text-main dark:text-gray-300">
            {/* Description Content */}
            <div className="flex-1 space-y-6 text-base leading-relaxed">
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4 whitespace-pre-line">{book.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-main dark:text-white relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-primary before:rounded-full">Sách cùng thể loại</h2>
            <Link to={`/browse?category=${book.categorySlug}`} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Xem tất cả 
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {loadingRelated ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : relatedBooks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">book</span>
              <p>Chưa có sách cùng thể loại</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  {...book} 
                  showHoverAction={true}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default BookDetail;