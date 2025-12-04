import { Link } from "react-router-dom"

function Header() {
  return (
    //Thẻ bao ngoài
    <div className="bg-blue-300 shadow-md w-full">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white hover:text-blue-700">BookShare</h1>
        
        {/* Menu bên phải */}
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-700">Home</Link>
          <a href="#" className="text-xl font-bold text-white hover:text-blue-700">Trò chuyện</a>
          <Link to="/add-book" className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
            Đăng bán sách
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Header;