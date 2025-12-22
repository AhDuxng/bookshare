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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="size-9 text-primary transition-transform group-hover:scale-110 duration-300">
                <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillOpacity="0.8"></path>
                  <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-text-primary dark:text-white text-xl font-bold leading-tight tracking-tight">BookMarket</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/browse" className="text-text-secondary dark:text-gray-300 text-[15px] font-medium leading-normal hover:text-primary transition-colors relative group">
                Danh mục
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className="text-text-secondary dark:text-gray-300 text-[15px] font-medium leading-normal hover:text-primary transition-colors relative group">
                Hỗ trợ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end gap-4 sm:gap-6">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-72 transition-all focus-within:max-w-[320px]">
              <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <div className="text-text-secondary dark:text-gray-400 flex items-center justify-center pl-4 pr-1">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full border-none bg-transparent h-full placeholder:text-gray-400 px-2 text-sm font-medium leading-normal focus:ring-0 text-text-primary dark:text-white" 
                  placeholder="Tìm kiếm sách..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
            </label>
            <div className="flex gap-3 items-center">
              <Link to="/add-book" className="hidden sm:flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-primary-dark active:scale-95 transition-all duration-200 text-white text-sm font-semibold leading-normal tracking-wide shadow-md shadow-primary/30">
                <span className="truncate">Đăng bán</span>
              </Link>
              <Link to="/cart" className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary hover:border-primary/30 transition-all shadow-sm relative">
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative group">
                    <button className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </button>
                    <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                        <div className="bg-white shadow-xl rounded-lg border border-gray-100 py-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">Xem trang cá nhân</Link>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">Đăng xuất</button>
                        </div>
                     </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                </Link>
              )}
              
              <button onClick={toggleMobileMenu} className="lg:hidden flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                 <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg py-4 px-6 flex flex-col gap-4 z-50">
            <Link to="/" className="text-text-primary dark:text-white font-medium hover:text-primary">Trang chủ</Link>
            <Link to="/browse" className="text-text-primary dark:text-white font-medium hover:text-primary">Danh mục</Link>
            <Link to="/contact" className="text-text-primary dark:text-white font-medium hover:text-primary">Hỗ trợ</Link>
            <Link to="/add-book" className="text-primary font-medium">Đăng bán sách</Link>
        </div>
      )}
    </header>
  );
}

export default Header;