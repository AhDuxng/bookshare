import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import SuccessPopup from "./SuccessPopup";
import { FormInput } from "./common";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Thêm state để hiện/ẩn mật khẩu
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/api/login", { username, password })
            .then((res) => {    
                // Save both user info and token
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                }
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("userId", res.data.user?.id);
                setShowPopup(true);
            })
            .catch((err) => {
                alert(err.response?.data?.message || "❌ Lỗi đăng nhập");
            });
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/");
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* <Header /> */}

            <SuccessPopup 
                isOpen={showPopup} 
                onClose={handlePopupClose} 
                message="Chào mừng bạn quay trở lại! Chúc bạn tìm được cuốn sách ưng ý."
                buttonText="Vào Trang Chủ"
            />
            
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
                    
                    {/* Tiêu đề chào mừng */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Chào mừng trở lại!</h2>
                        <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục khám phá kho sách cũ.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        
                        {/* Ô nhập Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc tên người dùng</label>
                            <div className="relative">
                                {/* Icon Người */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input 
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    placeholder="Nhập email hoặc tên người dùng"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Ô nhập Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <a href="#" className="text-sm text-blue-600 hover:underline font-medium">Quên mật khẩu?</a>
                            </div>
                            <div className="relative">
                                {/* Icon Ổ khóa */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />

                                {/* Nút Ẩn/Hiện mật khẩu */}
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Nút Đăng nhập */}
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 shadow-md transform active:scale-95">
                            Đăng nhập
                        </button>
                    </form>

                    {/* Footer chuyển sang đăng ký */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Chưa có tài khoản?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;