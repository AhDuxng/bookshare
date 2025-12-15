import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const slides = [
    {
        id: 1,
        image: "https://songhantourist.com/upload/articles-images/images/Kdokawa_from%20Kadokawa%20Culture%20Museum.jpeg",
        alt: "Library"
    },

    {
        id: 2,
        image: "https://cms.menutiger.com/wp-content/uploads/2024/07/book-cafe-menu.webp",
        alt: "Books and Coffee"
    },

    {
        id: 3,
        image: "https://thewilddetectives.com/wp-content/uploads/2016/04/Cover-1024x576.jpg",
        alt: "Reading Room"
    },

    {
        id: 4,
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/f1/11/82/photo6jpg.jpg?w=900&h=500&s=1",
        alt: "Book Store"
    }
];

function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, []);

    return (
    <div className="relative h-[450px] overflow-hidden bg-black max-w-7xl mx-auto mt-9 rounded-lg">
      
      {/* 3. Render danh sách ảnh */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.alt} 
            className="w-full h-full object-cover"
          />
          {/* Lớp phủ đen mờ */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
      ))}

      {/* 4. Nội dung Text (Luôn nằm trên cùng - z-index cao hơn) */}
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center h-full px-4 max-w-4xl text-left ml-9">
        <h1 className="text-4xl md:text-4xl font-[Arial] text-white mb-4 tracking-wide drop-shadow-md animate-fade-in-up">
          Sách Cũ Hay - Kho Tàng Tri Thức
        </h1>
        
        <p className="text-lg md:text-sm text-gray-200 mb-8 max-w-sm leading-relaxed animate-fade-in-up delay-100">
          Nơi kết nối những người yêu sách. Tìm kiếm, mua bán và chia sẻ những cuốn sách đã đọc. Khám phá ngay!
        </p>

        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl text-lg animate-fade-in-up delay-200"
        >
          Khám phá ngay
        </Link>
      </div>

      {/* 5. Các chấm tròn (Dots) điều hướng */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)} // Bấm vào để chuyển ảnh thủ công
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-gray-400 opacity-60 hover:bg-white hover:opacity-100"
            }`}
          ></button>
        ))}
      </div>

    </div>
  );
}

export default HeroBanner;