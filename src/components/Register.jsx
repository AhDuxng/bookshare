import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header"; // Giữ header nếu bạn muốn hiển thị menu

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "" // Thêm trường xác nhận mật khẩu
    });

    // Xử lý khi nhập liệu
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý khi bấm nút Đăng Ký
    const handleRegister = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra dữ liệu đầu vào
        if (!form.username || !form.password || !form.confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        // 2. Gửi dữ liệu xuống Backend
        try {
            // Lưu ý: Backend cần có API /api/register để nhận request này
            const response = await axios.post("http://localhost:3000/api/register", {
                username: form.username,
                password: form.password
            });

            if (response.status === 200 || response.status === 201) {
                alert("✅ Đăng ký thành công! Hãy đăng nhập ngay.");
                navigate("/login"); // Chuyển sang trang đăng nhập
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            // Kiểm tra nếu lỗi do tài khoản đã tồn tại (thường backend trả về 400 hoặc 409)
            if (error.response && error.response.data) {
                alert(`❌ Lỗi: ${error.response.data.message || "Đăng ký thất bại"}`);
            } else {
                alert("❌ Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            
            <div className="flex-grow flex items-center justify-center py-10">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng Ký Tài Khoản</h2>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Tên đăng nhập */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Tên đăng nhập</label>
                            <input 
                                type="text" 
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:outline-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên tài khoản..."
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Mật khẩu</label>
                            <input 
                                type="password" 
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:outline-blue-500 focus:border-blue-500"
                                placeholder="Nhập mật khẩu..."
                            />
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Xác nhận mật khẩu</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:outline-blue-500 focus:border-blue-500"
                                placeholder="Nhập lại mật khẩu..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition duration-300"
                        >
                            Đăng Ký
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;