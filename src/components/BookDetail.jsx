import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"; // Nhớ import axios
import Header from "./Header";

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null); // Ban đầu chưa có sách (null)

    useEffect(() => {
        // Gọi API lấy chi tiết sách theo ID
        axios.get(`http://localhost:3000/api/books/${id}`)
            .then((response) => {
                setBook(response.data);
            })
            .catch((error) => {
                console.error("Lỗi:", error);
            });
    }, [id]); // Khi ID thay đổi thì gọi lại API

    // Nếu đang tải hoặc không tìm thấy sách
    if (!book) {
        return (
            <div className="text-center mt-10">
                <p>Đang tải thông tin sách...</p>
                <Link to="/" className="text-blue-500 underline">Quay về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link to="/" className="text-gray-500 hover:text-black mb-4 inline-block">
                    &larr; Quay lại
                </Link>

                <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* CỘT 1: ẢNH */}
                    <div>
                        <img 
                            src={book.image} 
                            alt={book.title} 
                            className="w-full h-96 object-cover rounded-lg shadow-sm"
                        />
                    </div>

                    {/* CỘT 2: THÔNG TIN */}
                    <div className="flex flex-col justify-center text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
                        <p className="text-red-600 font-bold text-2xl mb-6">
                            {book.price.toLocaleString()} đ
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {book.description || "Người bán chưa nhập mô tả cho cuốn sách này."}
                        </p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-fit shadow-lg mx-auto">
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;