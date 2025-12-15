import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form (Ở đây chỉ alert mô phỏng)
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({ email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header />

      {/* BANNER PHỤ (Tùy chọn - Giúp trang đỡ trống) */}
      <div className="bg-blue-500 py-12 text-center text-white">
        <h1 className="text-3xl font-extrabold mb-2">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn hoặc kết nối qua các kênh bên dưới.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
          
          {/* --- CỘT TRÁI: THÔNG TIN LIÊN HỆ --- */}
          <div className="bg-blue-50 p-8 md:p-10 border-r border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Liên hệ hỗ trợ
            </h2>

            <div className="space-y-6">
              {/* Câu hỏi thường gặp */}
              <div>
                <a href="#" className="flex items-center text-blue-600 font-semibold hover:underline group transition">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Câu hỏi thường gặp (FAQ)
                </a>
              </div>

              {/* Fanpage */}
              <div>
                <a href="#" className="flex items-center text-blue-700 font-semibold hover:underline group transition">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.4.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.595 1.323-1.325V1.325C24 .595 23.405 0 22.675 0z" />
                    </svg>
                  </span>
                  Sách Cũ Hay Fanpage
                </a>
              </div>

              {/* Chat hỗ trợ */}
              <div>
                <a href="#" className="flex items-center text-teal-600 font-semibold hover:underline group transition">
                  <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3 group-hover:bg-teal-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Chat với hỗ trợ viên
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center text-gray-600">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </span>
                support@sacchuhay.com
              </div>

              {/* Giờ làm việc */}
              <div className="flex items-center text-gray-600">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                </span>
                Thứ 2 - Thứ 7: 08:00am - 10:00pm
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-200">
              <p className="text-sm text-gray-500 italic">
                "Nhân viên hỗ trợ của chúng tôi sẽ cố gắng xử lý khiếu nại và giải quyết thắc mắc của các bạn nhanh nhất có thể."
              </p>
            </div>
          </div>

          {/* --- CỘT PHẢI: FORM GỬI TIN NHẮN --- */}
          <div className="p-8 md:p-10 md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email của bạn</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                    placeholder="0912..."
                  />
                </div>
              </div>

              {/* Chủ đề */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chủ đề</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                  placeholder="Vấn đề cần hỗ trợ..."
                  required
                />
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung tin nhắn</label>
                <textarea 
                  rows="5"
                  name="message"
                  value={formData.message} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white resize-none"
                  placeholder="Chi tiết vấn đề bạn đang gặp phải..."
                  required
                ></textarea>
              </div>

              {/* Button Gửi */}
              <div>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                  Gửi tin nhắn
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;