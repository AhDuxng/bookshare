import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { BookCard, Badge, FilterButton, PaginationButton } from './common';

function BrowseBooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:3000/api/books/search';
        const params = {
          page: 1,
          limit: 20,
          sort: 'created_at',
          query: '' // Truyền empty query để lấy tất cả
        };

        // Nếu có category được chọn, lấy sách theo category
        if (selectedCategory && selectedCategory !== 'all') {
          const category = categories.find(c => c.id === parseInt(selectedCategory));
          if (category) {
            url = `http://localhost:3000/api/categories/${category.slug}/books`;
          }
        }

        const response = await axios.get(url, selectedCategory === 'all' ? { params } : {});
        console.log('Books API Response:', response.data);
        const booksData = response.data.books || response.data || [];
        setBooks(booksData);
      } catch (error) {
        console.error('Lỗi khi lấy sách:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || selectedCategory === 'all') {
      fetchBooks();
    }
  }, [selectedCategory, categories]);

  // Cập nhật selectedCategory khi URL params thay đổi
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  // Handler để thay đổi category
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display overflow-x-hidden min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary-dark">
      <Header />

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 py-8">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex flex-wrap gap-2 items-center text-sm mb-3">
              <Link to="/" className="text-slate-500 font-medium hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span> Trang chủ
              </Link>
              <span className="text-slate-400 material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-800 dark:text-white font-semibold">Duyệt sách</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Khám phá kho sách</h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Tìm kiếm những cuốn sách yêu thích từ cộng đồng đọc sách.</p>
          </div>
          
          {/* Mobile Filter & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="md:hidden flex-1 relative">
              <button className="w-full flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                <span>Bộ lọc</span>
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
            <div className="relative min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <span className="material-symbols-outlined text-[20px]">sort</span>
              </div>
              <select className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
                <option>Mới nhất</option>
                <option>Giá: Thấp đến cao</option>
                <option>Giá: Cao đến thấp</option>
                <option>Phổ biến nhất</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
            <div className="hidden md:flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
              <button className="p-2 rounded md:rounded-md bg-primary/10 text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>
              <button className="p-2 rounded md:rounded-md text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">view_list</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
            
            {/* Category Filter */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-primary">
                  <span className="material-symbols-outlined text-[18px]">category</span>
                </span>
                Thể loại
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleCategoryChange('all')}>
                  <div className="relative flex items-center">
                    <input 
                      checked={selectedCategory === 'all'} 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-all" 
                      type="radio"
                      readOnly
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span className={`text-sm group-hover:text-primary transition-colors flex-1 ${selectedCategory === 'all' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                    Tất cả
                  </span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleCategoryChange(cat.id.toString())}>
                    <div className="relative flex items-center">
                      <input 
                        checked={selectedCategory === cat.id.toString()} 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-all" 
                        type="radio"
                        readOnly
                      />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className={`text-sm group-hover:text-primary transition-colors flex-1 ${selectedCategory === cat.id.toString() ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                  <span className="material-symbols-outlined text-[18px]">attach_money</span>
                </span>
                Khoảng giá
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">đ</span>
                  <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-6 pr-2 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 font-medium" placeholder="Min" type="text"/>
                </div>
                <span className="text-slate-400 font-medium">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">đ</span>
                  <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-6 pr-2 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 font-medium" placeholder="Max" type="text"/>
                </div>
              </div>
              <button className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white text-slate-700 dark:text-white text-sm font-bold py-2.5 rounded-lg transition-all active:scale-95 shadow-sm">
                Áp dụng
              </button>
            </div>

            {/* Condition Filter */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
                Tình trạng
              </h3>
              <div className="space-y-3">
                {["Mới 100%", "Như mới (99%)", "Đã qua sử dụng"].map((cond, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input defaultChecked={idx === 2} className="peer appearance-none w-5 h-5 border border-slate-300 rounded-full checked:border-primary checked:border-[6px] transition-all bg-white" name="condition" type="radio"/>
                    </div>
                    <span className={`text-sm group-hover:text-slate-800 transition-colors ${idx === 2 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </span>
                Khu vực
              </h3>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                </div>
                <select className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer hover:border-slate-300">
                  <option>Toàn quốc</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-slate-700">
                <span className="text-sm font-medium text-primary">
                  Hiển thị {books.length > 0 ? `1 - ${books.length}` : '0'} <span className="text-slate-500 dark:text-slate-400 font-normal">trong {books.length} kết quả</span>
                </span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[48px] text-slate-400">book</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy sách</h3>
                <p className="text-slate-500 mb-4">Thử thay đổi bộ lọc hoặc quay lại sau nhé!</p>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
                >
                  Xem tất cả sách
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => {
                  // Map dữ liệu từ database
                  const bookData = {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price ? `${Number(book.price).toLocaleString()}đ` : 'Liên hệ',
                    image: book.image_url,
                    condition: book.condition || 'good',
                    user: book.users ? {
                      name: book.users.username,
                      avatar: book.users.avatar_url
                    } : null,
                    showHoverAction: true
                  };
                  
                  return (
                    <BookCard 
                      key={book.id}
                      {...bookData}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/30 transition-colors">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors">3</button>
                <div className="flex items-end justify-center h-10 pb-2 text-slate-400 font-medium px-2">...</div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BrowseBooks;