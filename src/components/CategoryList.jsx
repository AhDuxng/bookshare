import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, BookCard, Button } from './common';

const API_BASE = (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || 'http://localhost:3000';

function CategoryList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true); setError(null);
      try {
        // Ưu tiên sách phổ biến; nếu backend chưa hỗ trợ thì fallback về mới nhất
        const popularReq = axios.get(`${API_BASE}/api/books/search`, {
          params: { page: 1, limit: 10, sort: 'popular', query: '' }
        });
        const latestReq = axios.get(`${API_BASE}/api/books/search`, {
          params: { page: 1, limit: 10, sort: 'created_at', query: '' }
        });

        // Chạy song song, dùng popular nếu có dữ liệu, ngược lại dùng latest
        const [popularRes, latestRes] = await Promise.allSettled([popularReq, latestReq]);

        const pickBooks = (res) => {
          if (res.status !== 'fulfilled') return [];
          const data = res.value.data;
          return data?.books || data || [];
        };

        const popularBooks = pickBooks(popularRes);
        const latestBooks = pickBooks(latestRes);
        const chosen = popularBooks.length > 0 ? popularBooks : latestBooks;
        setBooks(chosen);
      } catch (err) {
        console.error('Lỗi lấy sách nổi bật:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const displayBooks = useMemo(() => books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price ? `${Number(book.price).toLocaleString()}đ` : 'Liên hệ',
    image: book.image_url,
    condition: book.condition || 'good',
    user: book.users ? {
      name: book.users.username,
      avatar: book.users.avatar_url,
    } : null,
  })), [books]);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Sách nổi bật" iconColor="bg-amber-500" badge={{ text: 'Phổ biến', color: 'amber' }} />
        <button
          onClick={() => navigate('/browse')}
          className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          Xem tất cả
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-sm text-red-500 py-10">Không thể tải sách nổi bật. Vui lòng thử lại.</div>
      ) : displayBooks.length === 0 ? (
        <div className="text-center text-sm text-slate-500 py-10">Chưa có sách nổi bật.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {displayBooks.map(book => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryList;