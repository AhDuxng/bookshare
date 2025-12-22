import { useEffect, useState } from "react"; // Import hook của React
import axios from "axios";                   // Import thư viện gọi API
import Header from "./Header";
import { Link } from "react-router-dom";
import HeroBanner from "./HeroBanner";
import CategoryList from "./CategoryList";
import BookList from "./BookList";
import Footer from "./Footer";
import { IconBox, FeatureCard } from "./common";

function Home() {
  // Tạo kho chứa sách (ban đầu là rỗng)
  const [books, setBooks] = useState([]);

  // Gọi API ngay khi trang web vừa hiện lên
  useEffect(() => {
    // Gọi đến API Backend
    axios.get("http://localhost:3000/api/books")
      .then((response) => {
        // Nếu thành công -> Lưu dữ liệu vào kho 'books'
        setBooks(response.data);
        console.log("Đã lấy được sách:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi không lấy được sách:", error);
      });
  }, []); // Dấu [] nghĩa là chỉ gọi 1 lần duy nhất

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-primary dark:text-gray-100 overflow-x-hidden antialiased selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col max-w-[1440px] w-full flex-1 gap-10 sm:gap-14">
            <HeroBanner /> 

            <section className="py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 px-6 sm:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="max-w-[1200px] mx-auto w-full relative z-10">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
                            <h2 className="text-text-primary dark:text-white text-3xl font-bold leading-tight">Cách thức hoạt động</h2>
                            <p className="text-text-secondary dark:text-gray-400 text-lg">Quy trình đơn giản giúp bạn mua bán sách cũ an toàn và tiện lợi</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                              icon="photo_camera"
                              iconColor="blue"
                              title="1. Đăng bán"
                              description="Chụp ảnh, mô tả tình trạng sách và đăng tin chỉ trong 30 giây hoàn toàn miễn phí."
                            />
                            <FeatureCard
                              icon="verified_user"
                              iconColor="blue"
                              title="2. Giao dịch an toàn"
                              description="Hệ thống giữ tiền người mua đảm bảo an toàn cho đến khi xác nhận nhận được sách đúng mô tả."
                            />
                            <FeatureCard
                              icon="local_shipping"
                              iconColor="blue"
                              title="3. Vận chuyển tận nơi"
                              description="Đối tác vận chuyển sẽ đến lấy sách tận nhà người bán và giao tận tay người mua trên toàn quốc."
                            />
                        </div>
                    </div>
                </div>
            </section>

            <CategoryList />
            
            <BookList books={books} />

            <section className="mt-14 mb-8 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white shadow-2xl shadow-primary/30">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop')]" data-alt="Abstract books texture pattern" style={{mixBlendMode: 'overlay'}}></div>
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                    <div className="flex flex-col gap-4 max-w-xl">
                        <h2 className="text-3xl sm:text-4xl font-black leading-tight">Dọn kệ sách cũ,<br/>đón niềm vui mới</h2>
                        <p className="text-blue-50 text-lg font-medium leading-relaxed opacity-90">Hàng ngàn người đang tìm kiếm cuốn sách bạn không còn đọc nữa. Chia sẻ tri thức và nhận lại giá trị ngay hôm nay!</p>
                    </div>
                    <button className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-xl font-bold shadow-xl shadow-black/10 transition-all hover:scale-105 hover:shadow-black/20 whitespace-nowrap text-lg flex items-center gap-2 group">
                        Bắt đầu bán sách
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                </div>
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;