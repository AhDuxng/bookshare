import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header"; 
import SuccessPopup from "./SuccessPopup";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "" // Thêm trường xác nhận mật khẩu
    });
    
    const [showPopup, setShowPopup] = useState(false);

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

        // Kiểm tra dữ liệu đầu vào
        if (!form.username || !form.email || !form.password || !form.confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        // Gửi dữ liệu xuống Backend
        try {
            // Lưu ý: Backend cần có API /api/register để nhận request này
            const response = await axios.post("http://localhost:3000/api/register", {
                username: form.username,
                email: form.email,
                password: form.password
            });

            if (response.status === 200 || response.status === 201) {
                setShowPopup(true);
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
    // xử lý khi bấm nút "Đồng ý" trên Popup
    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/login"); // Chuyển sang trang đăng nhập
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            
            {/* <Header /> */}

            <SuccessPopup 
                isOpen={showPopup} 
                onClose={handlePopupClose} 
                message="Tài khoản của bạn đã được tạo thành công. Hãy đăng nhập ngay!"
                buttonText="Đến trang Đăng nhập"
            />

            <div className="flex-grow flex items-center justify-center p-4">
                
                <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">

                    <div className="w-full md:w-1/2 p-8 sm:p-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h2>
                        <p className="text-gray-600 mb-8 text-sm text-lg">Tham gia cộng đồng yêu sách của chúng tôi.</p>

                        <form onSubmit={handleRegister} className="space-y-4">
                            
                            {/* Tên người dùng */}
                            <div>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    placeholder="Tên người dùng"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    placeholder="Email"
                                />
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    placeholder="Mật khẩu"
                                />
                            </div>

                            {/* Nhập lại mật khẩu */}
                            <div>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    placeholder="Xác nhận mật khẩu"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-6 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Đăng Ký Tài Khoản
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <p className="text-gray-600">
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login" className="text-blue-400 font-bold hover:underline">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block w-1/2 relative">
                        <img
                            className="absolute inset-0 h-full w-full object-cover"
                            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="BookShare Register"
                        />
                        <div className="absolute inset-0 bg-black opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;