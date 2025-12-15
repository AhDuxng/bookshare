import { useEffect, useState } from "react"; // Import hook của React
import axios from "axios";                   // Import thư viện gọi API
import Header from "./Header";
import { Link } from "react-router-dom";
import HeroBanner from "./HeroBanner";
import CategoryList from "./CategoryList";
import BookList from "./BookList";
import Footer from "./Footer";

function Home() {
  // Tạo kho chứa sách (ban đầu là rỗng)
  const [books, setBooks] = useState([]);

  // Gọi API ngay khi trang web vừa hiện lên
  useEffect(() => {
    // Gọi đến API Backend
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

      <HeroBanner /> 

      <CategoryList />
      
      <BookList books={books} />

      <Footer />
    </div>
  );
}

export default Home;