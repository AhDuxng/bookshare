import React from 'react';
import { Link } from 'react-router-dom';

function CategoryList() {
  // Dữ liệu danh mục (Giả lập giống hình ảnh bạn gửi)
  const categories = [
    { 
      id: 1, 
      name: "Văn học", 
      color: "bg-blue-50 text-blue-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    { 
      id: 2, 
      name: "Kinh tế", 
      color: "bg-purple-50 text-purple-600", // Màu tím nhạt
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    { 
      id: 3, 
      name: "Thiếu nhi", 
      color: "bg-sky-50 text-sky-600", // Màu xanh trời nhạt
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.414-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      )
    },
    { 
      id: 4, 
      name: "Kỹ năng", 
      color: "bg-teal-50 text-teal-600", // Màu xanh cổ vịt nhạt
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.854 1.591-2.16 1.154-.379 1.969-1.507 1.969-2.722a4.19 4.19 0 00-8.384 0c0 1.214.815 2.342 1.97 2.722.933.306 1.591 1.177 1.591 2.16v.218m0 0a6.732 6.732 0 01-3 0" />
        </svg>
      )
    },
    { 
      id: 5, 
      name: "Ngoại ngữ", 
      color: "bg-indigo-50 text-indigo-600", // Màu chàm nhạt
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
      )
    },
    { 
      id: 6, 
      name: "Học thuật", 
      color: "bg-blue-50 text-blue-600", // Màu xanh dương nhạt
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.258 50.558 50.558 0 01-2.658.812m-15.482 0A50.555 50.555 0 0112 13.489a50.555 50.555 0 0112-4.908M20.308 10.25a18.9 18.9 0 009.692 3.25" />
        </svg>
      )
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tiêu đề mục */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Danh mục nổi bật
      </h2>

      {/* Lưới danh mục: 2 cột trên mobile, 3 trên tablet, 6 trên desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link 
            to="/" 
            key={cat.id}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition duration-300 group cursor-pointer"
          >
            {/* Vòng tròn nền màu nhạt */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition duration-300 group-hover:scale-110 ${cat.color}`}>
              {cat.icon}
            </div>
            
            {/* Tên danh mục */}
            <span className="font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;