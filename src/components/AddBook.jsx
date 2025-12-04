import axios from "axios"; 
import { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate, Link } from "react-router-dom"; 

function AddBook() {
    const navigate = useNavigate();

    // 1. Tạo biến State
    const [form, setForm] = useState({
        title: "",
        price: "",
        image: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Bạn cần đăng nhập để bán sách");
            navigate("/login");
        }
    }, [navigate]); // Thêm navigate vào dependency array cho chuẩn React

    // --- BỎ DẤU } Ở ĐÂY ---

    // 2. Hàm xử lý khi người dùng gõ phím
    const handleChange = (e) => {
        setForm({
            ...form, 
            [e.target.name]: e.target.value, 
        });
    };

    // 3. Hàm xử lý khi bấm nút Đăng Bán
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(!form.title || !form.price) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        axios.post("http://localhost:3000/api/books", form)
            .then((response) => {
                alert("✅ Đã đăng bán thành công!");
                navigate("/"); 
            })
            .catch((error) => {
                console.error("Lỗi:", error);
                alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                <Link to="/" className="text-gray-500 hover:text-black mb-4 inline-block">&larr; Quay lại</Link>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đăng bán sách cũ</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* CỘT TRÁI: FORM NHẬP LIỆU */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Tên sách</label>
                            <input 
                                type="text" name="title" 
                                value={form.title} onChange={handleChange}
                                className="w-full border p-2 rounded focus:outline-blue-500"
                                placeholder="Ví dụ: Đắc Nhân Tâm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Giá bán (VNĐ)</label>
                            <input 
                                type="number" name="price" 
                                value={form.price} onChange={handleChange}
                                className="w-full border p-2 rounded focus:outline-blue-500"
                                placeholder="Ví dụ: 50000"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Link Ảnh bìa (URL)</label>
                            <input 
                                type="text" name="image" 
                                value={form.image} onChange={handleChange}
                                className="w-full border p-2 rounded focus:outline-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
                            Đăng ngay
                        </button>
                    </form>

                    {/* CỘT PHẢI: XEM TRƯỚC (PREVIEW) */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                        <h3 className="text-gray-500 font-bold mb-4 uppercase text-sm">Xem trước tin đăng</h3>
                        
                        <img 
                            src={form.image || "https://via.placeholder.com/150"} 
                            alt="Preview" 
                            className="w-48 h-64 object-cover rounded-md shadow-sm mb-4 bg-gray-200"
                            onError={(e) => {e.target.src = "https://via.placeholder.com/150"}} // Thêm dòng này để nếu link ảnh lỗi thì hiện ảnh mặc định
                        />
                        
                        <h3 className="text-xl font-bold text-center text-gray-800">
                            {form.title || "Tên sách sẽ hiện ở đây"}
                        </h3>
                        <p className="text-red-600 font-bold text-xl mt-2">
                            {form.price ? Number(form.price).toLocaleString() : "0"} đ
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddBook;