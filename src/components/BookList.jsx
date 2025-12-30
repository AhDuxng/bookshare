import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SectionHeader, BookCard } from './common';

function BookList({ books }) {
  const navigate = useNavigate();
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách sách mới nhất từ API
  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books/search', {
          params: {
            page: 1,
            limit: 10,
            sort: 'created_at',
            query: '' // Truyền empty query để lấy tất cả
          }
        });
        console.log('API Response:', response.data);
        const booksData = response.data.books || response.data || [];
        setLatestBooks(booksData);
      } catch (error) {
        console.error('Lỗi khi lấy sách mới:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);
  
  const displayBooks = latestBooks.length > 0 ? latestBooks : [];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader 
          title="Sách mới đăng" 
          iconColor="bg-red-500"
          badge={{ text: "Mới nhất", color: "red" }}
        />
        <button
          onClick={() => navigate('/browse')}
          className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          Xem tất cả
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[40px] text-slate-400">book</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Chưa có sách nào</h3>
          <p className="text-slate-500 text-sm">Hãy trở thành người đăng tin đầu tiên!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {displayBooks.map(book => {
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
              } : null
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
    </section>
  );
}

export default BookList;