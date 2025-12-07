import { useEffect, useState } from "react"; // Import hook của React
import axios from "axios";                   // Import thư viện gọi API
import Header from "./Header";
import { Link } from "react-router-dom";

function Home() {
  // Tạo kho chứa sách (ban đầu là rỗng)
  const [books, setBooks] = useState([]);

  // Gọi API ngay khi trang web vừa hiện lên
  useEffect(() => {
    // Gọi đến API Backend mình vừa viết hôm qua
    axios.get("http://localhost:3000/api/books")
      .then((response) => {
        // Nếu thành công -> Lưu dữ liệu vào kho 'books'
        setBooks(response.data);
        console.log("Đã lấy được sách:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi không lấy được sách:", error);
      });
  }, []); // Dấu [] nghĩa là chỉ gọi 1 lần duy nhất

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sách mới đăng (Dữ liệu thật)</h2>
        
        {/* Kiểm tra nếu chưa có sách thì hiện Loading */}
        {books.length === 0 ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Vòng lặp hiển thị sách */}
            {books.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-55 h-64 object-cover mb-4 mx-auto" 
                />
                <h3 className="font-bold text-gray-800 truncate text-center">{book.title}</h3>
                <p className="text-red-600 font-bold text-xl mt-2 text-center">{book.price.toLocaleString()} đ</p>
                
                <Link to={`/book/${book.id}`} className="block text-center mt-3 w-full bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 font-semibold">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Home;