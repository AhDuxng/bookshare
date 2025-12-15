import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer"; // Nếu bạn đã tạo Footer thì import vào cho đẹp

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1); // 1. State lưu số lượng muốn mua

    useEffect(() => {
        axios.get(`http://localhost:3000/api/books/${id}`)
            .then((response) => {
                setBook(response.data);
            })
            .catch((error) => {
                console.error("Lỗi:", error);
            });
    }, [id]);

    // 2. Hàm xử lý thêm vào giỏ hàng
    // Tham số isBuyNow: true (Mua ngay -> Chuyển trang), false (Thêm vào giỏ -> Ở lại)
    const handleAddToCart = (isBuyNow = false) => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        // 1. Kiểm tra đăng nhập
        if (!user) {
            alert("Bạn cần đăng nhập để mua sách!");
            navigate("/login");
            return;
        }

        // 2. Gọi API thêm vào giỏ
        axios.post("http://localhost:3000/api/cart", {
            user_id: user.id,
            book_id: book.id,
            quantity: quantity
        })
        .then(() => {
            if (isBuyNow) {
                // Nếu bấm Mua ngay -> Chuyển sang trang giỏ hàng
                navigate("/cart");
            } else {
                // Nếu bấm Thêm vào giỏ -> Thông báo thành công
                alert("✅ Đã thêm sách vào giỏ hàng!");
            }
        })
        .catch((error) => {
            console.error("Lỗi thêm giỏ hàng:", error);
            alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
        });
    };

    if (!book) {
        return (
            <div className="text-center mt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải thông tin sách...</p>
                <Link to="/" className="text-blue-500 underline mt-2 inline-block">Quay về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header />
            
            <div className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700 font-medium truncate">{book.title}</span>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* CỘT 1: ẢNH SÁCH */}
                    <div className="flex justify-center items-start bg-gray-50 rounded-xl p-4">
                        <img 
                            src={book.image} 
                            alt={book.title} 
                            className="w-auto h-96 object-contain shadow-lg rounded-md hover:scale-105 transition duration-300"
                        />
                    </div>

                    {/* CỘT 2: THÔNG TIN CHI TIẾT */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                            {book.title}
                        </h1>
                        
                        <p className="text-gray-500 mb-4 text-lg">
                            Tác giả: <span className="font-semibold text-gray-800">{book.author || "Chưa cập nhật"}</span>
                        </p>

                        <div className="text-3xl font-bold text-blue-600 mb-6 bg-blue-50 w-fit px-4 py-2 rounded-lg">
                            {book.price.toLocaleString()} đ
                        </div>

                        {/* Ô chọn số lượng */}
                        <div className="flex items-center mb-6">
                            <span className="font-medium text-gray-700 mr-4">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                >-</button>
                                <input 
                                    type="number" 
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                                />
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                >+</button>
                            </div>
                        </div>

                        {/* Mô tả sách */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Mô tả sản phẩm</h3>
                            <p className="text-gray-600 leading-relaxed text-justify">
                                {book.description || "Người bán chưa nhập mô tả chi tiết cho cuốn sách này."}
                            </p>
                        </div>

                        {/* Cụm nút hành động */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            {/* Nút Thêm vào giỏ */}
                            <button 
                                onClick={() => handleAddToCart(false)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition transform active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                Thêm vào giỏ
                            </button>

                            {/* Nút Mua ngay */}
                            <button 
                                onClick={() => handleAddToCart(true)}
                                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform active:scale-95"
                            >
                                Mua ngay
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default BookDetail;