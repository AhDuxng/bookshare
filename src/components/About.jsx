import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { IconBox, Badge } from './common';

function About() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />

      {/* 1. HERO BANNER */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* Ảnh nền */}
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Bookshelf Background" 
          className="w-full h-full object-cover"
        />
        {/* Lớp phủ tối màu */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Nội dung chính */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-wide uppercase">
            Kết Nối Người Yêu Sách, Trao Đi Tri Thức
          </h1>
          <p className="text-gray-200 text-sm md:text-lg max-w-2xl font-light">
            Khám phá một cộng đồng nơi những cuốn sách cũ tìm thấy ngôi nhà mới và những câu chuyện được tiếp nối.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. CÂU CHUYỆN CỦA CHÚNG TÔI */}
        <div className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-2 block">Câu chuyện của chúng tôi</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Hành Trình Của Những Trang Sách
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-justify">
              Ra đời từ niềm đam mê với những trang sách cũ và mong muốn tạo ra một không gian bền vững cho tri thức, Sách Cũ Hay là cầu nối cho những người yêu sách trên khắp mọi miền.
            </p>
            <p className="text-gray-600 leading-relaxed text-justify">
              Chúng tôi tin rằng mỗi cuốn sách đều có một linh hồn và xứng đáng được tiếp tục hành trình của mình, từ tay người đọc này đến tay người đọc khác, thay vì nằm im lìm trên kệ hay bị lãng quên.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://media.istockphoto.com/id/1481862788/vi/anh/ch%E1%BB%93ng-s%C3%A1ch-v%E1%BB%9Bi-n%E1%BB%81n-k%E1%BB%87-s%C3%A1ch-m%E1%BB%9D-%C4%91%E1%BB%8Dc-h%E1%BB%8Dc-gi%C3%A1o-d%E1%BB%A5c-ho%E1%BA%B7c-kh%C3%A1i-ni%E1%BB%87m-v%C4%83n-ph%C3%B2ng-t%E1%BA%A1i-nh%C3%A0.jpg?b=1&s=612x612&w=0&k=20&c=uqNNQ7hw2qwS6y5b1zVeYbveEUUYYuRJULUzdXFwNLA=" 
              alt="Reading Journey" 
              className="rounded-2xl shadow-xl w-full object-cover h-80 md:h-96"
            />
            {/* Decor blob (tùy chọn cho đẹp) */}
            <div className="absolute -z-10 top-[-20px] right-[-20px] w-full h-full border-2 border-blue-100 rounded-2xl"></div>
          </div>
        </div>

        {/* 3. GIÁ TRỊ CỐT LÕI (4 Cards) */}
        <div className="py-12">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold text-sm tracking-wider uppercase">Giá trị cốt lõi</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Sứ Mệnh & Tầm Nhìn</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Chúng tôi không chỉ là một nền tảng mua bán. Chúng tôi xây dựng một cộng đồng dựa trên sự tin tưởng và đam mê tri thức.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 text-center group">
              <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cộng đồng</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Xây dựng một không gian kết nối mạnh mẽ cho những người cùng sở thích đọc sách.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 text-center group">
              <div className="w-14 h-14 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bền vững</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Thúc đẩy việc tái sử dụng sách, giảm thiểu lãng phí và lan tỏa văn hóa đọc bền vững.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 text-center group">
              <div className="w-14 h-14 mx-auto bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tin cậy</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Đảm bảo mọi giao dịch đều minh bạch, an toàn và đáng tin cậy cho cả người mua và người bán.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 text-center group">
              <div className="w-14 h-14 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Đam mê tri thức</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Khơi dậy và lan tỏa tình yêu với sách, khuyến khích việc chia sẻ và khám phá tri thức.</p>
            </div>
          </div>
        </div>

        {/* 4. CALL TO ACTION (CTA) */}
        <div className="my-20 bg-blue-50 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              Tham gia vào hành trình của chúng tôi
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Hãy là một phần của cộng đồng Sách Cũ Hay. Cùng nhau, chúng ta lan tỏa tri thức và mang đến cuộc sống thứ hai cho những cuốn sách.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-md">
                Khám Phá Kho Sách
              </Link>
              <Link to="/register" className="bg-white text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition shadow-sm">
                Tham Gia Cộng Đồng
              </Link>
            </div>
          </div>
          {/* Background circles decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default About;