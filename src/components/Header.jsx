import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    //Thẻ bao ngoài
    <div className="bg-blue-300 shadow-md w-full">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white hover:text-blue-700">BookShare</h1>
        

        <div className="flex gap-4 items-center">
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-700">Trang chủ</Link>
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-700">Bài đăng</Link>
          {user ? (
             <div className="flex gap-3 items-center">
                <Link to="/add-book" className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
                    Đăng bán sách
                </Link>
                <div className="flex flex-col items-end justify-center">
                  <span className="text-white font-bold">Hi, {user.full_name || user.username}</span>
                  <button onClick={handleLogout} className="text-white hover:text-red-600 underline">Đăng xuất</button>
                </div>
             </div>
          ) : (
             <Link to="/login" className="text-xl font-bold text-white hover:text-blue-200 bg-blue-600 p-2 rounded-md">
                Đăng nhập
             </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;