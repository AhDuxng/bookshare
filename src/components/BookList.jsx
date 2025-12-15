import React from 'react';
import { Link } from 'react-router-dom';

function BookList({ books }) {
  const renderStars = () => (
    <div className="flex text-yellow-400 text-xs">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );

  if (books.length === 0) {
    return <p className="text-center text-gray-500 py-10">Chưa có sách nào được đăng bán.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sách mới đăng bán</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col p-4">
            
            {/* Ảnh sách */}
            <div className="h-56 w-full flex items-center justify-center bg-gray-50 overflow-hidden mb-4 relative group">
               <img 
                 src={book.image} 
                 alt={book.title} 
                 className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                 onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=No+Image"}} // Xử lý nếu ảnh lỗi
               />
            </div>

            {/* Nội dung */}
            <div className="flex-grow flex flex-col">
                <Link to={`/book/${book.id}`}>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2 hover:text-blue-600 transition">
                        {book.title}
                    </h3>
                </Link>
                
                <p className="text-sm text-gray-500 mb-2">
                    Tác giả: <span className="font-medium text-gray-700">{book.author || "Chưa cập nhật"}</span>
                </p>
                
                <p className="text-blue-600 font-bold text-xl mb-2">
                    {book.price.toLocaleString()} đ
                </p>

                <div className="flex items-center gap-2 mb-4">
                    {renderStars()}
                    <span className="text-xs text-gray-400">(120)</span>
                </div>
            </div>

            {/* Footer: Người bán & Nút Mua */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-600 truncate max-w-[100px]">
                        {book.username || "Ẩn danh"}
                    </span>
                </div>

                <Link 
                    to={`/book/${book.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg"
                >
                    Mua ngay
                </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;