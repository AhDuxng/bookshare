import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cartCount] = useState(0);

  // State quản lý menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State quản lý thanh tìm kiếm mobile
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // State lưu từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      alert(`Đang tìm kiếm: ${keyword}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- PHẦN 1: LOGO & HAMBURGER --- */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-blue-700 transition hidden sm:block">Sách Cũ Hay</span>
              <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-blue-700 transition sm:hidden">SCH</span>
            </Link>
          </div>

          {/* --- PHẦN 2: MENU DESKTOP --- */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="text-gray-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 transition">Trang chủ</Link>
            <Link to="/" className="text-gray-600 font-medium px-4 py-2 rounded-md hover:text-blue-600 hover:bg-blue-100 transition">Danh mục</Link>
            <Link to="/add-book" className="text-gray-600 font-medium px-4 py-2 rounded-md hover:text-blue-600 hover:bg-blue-100 transition">Bán Sách</Link>
            <Link to="/" className="text-gray-600 font-medium px-4 py-2 rounded-md hover:text-blue-600 hover:bg-blue-100 transition">Giới thiệu</Link>
            <Link to="/" className="text-gray-600 font-medium px-4 py-2 rounded-md hover:text-blue-600 hover:bg-blue-100 transition">Liên hệ</Link>
          </nav>

          {/* --- PHẦN 3: ICONS --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition w-64">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-500"
              />
            </form>

            <button 
              onClick={toggleMobileSearch}
              className={`lg:hidden p-2 rounded-md hover:bg-gray-100 transition ${isMobileSearchOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
            >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
            </button>

            <div className="relative cursor-pointer text-gray-700 hover:text-blue-600 transition p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.07.586 0 .872l-1.263 5a2.25 2.25 0 01-2.182 1.821H6.83a2.25 2.25 0 01-2.182-1.821l-1.263-5a2.25 2.25 0 010-.872l1.263-5a2.25 2.25 0 012.182-1.821h10.278a2.25 2.25 0 012.182 1.821z" />
              </svg>
              <span className="absolute top-1 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            </div>

            {/* --- PHẦN BẠN CẦN CHÚ Ý ĐỂ SỬA LỖI --- */}
            {user ? (
              <div className="relative group cursor-pointer flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {user.username.charAt(0).toUpperCase()}
                 </div>
                 
                 {/* SỬA: Thay 'mt-2' bằng 'pt-2' ở đây để tạo cầu nối */}
                 <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                    {/* Di chuyển các class bg-white, shadow, border vào thẻ con bên trong */}
                    <div className="bg-white shadow-xl rounded-lg border border-gray-100 py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">Đăng xuất</button>
                    </div>
                 </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white p-4 shadow-md absolute w-full left-0 z-40 animate-fade-in-down">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm tên sách, tác giả..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700"
                autoFocus
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Tìm
            </button>
          </form>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white absolute w-full left-0 z-40 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-blue-600 bg-blue-50">Trang chủ</Link>
            <Link to="/" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Danh mục</Link>
            <Link to="/add-book" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Bán Sách</Link>
            <Link to="/" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Giới thiệu</Link>
            <Link to="/" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Liên hệ</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;