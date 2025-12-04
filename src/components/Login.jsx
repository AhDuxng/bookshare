import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/api/login", {username, password})
            .then((res) => {
                alert("Đăng nhập thành công!");

                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/");
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Lỗi đăng nhập");
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Đăng nhập</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        className="w-full border p-2 rounded"
                        placeholder="Tên đăng nhập"
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input 
                        type="password"
                        className="w-full border p-2 rounded"
                        placeholder="Mật khẩu"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">
                        Đăng nhập
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
