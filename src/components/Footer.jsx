import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3 text-primary">
                        <svg className="size-9 drop-shadow-sm" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor"></path>
                            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                        <span className="text-text-primary dark:text-white text-2xl font-black tracking-tight">BookMarket</span>
                    </div>
                    <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                        Nền tảng kết nối cộng đồng yêu sách, giúp việc trao đổi và mua bán sách trở nên dễ dàng, an toàn và văn minh.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-text-primary dark:text-white font-bold text-lg">Về chúng tôi</h4>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Giới thiệu</Link>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Quy chế hoạt động</Link>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Chính sách bảo mật</Link>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-text-primary dark:text-white font-bold text-lg">Hỗ trợ</h4>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Trung tâm trợ giúp</Link>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Hướng dẫn mua hàng</Link>
                    <Link to="#" className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors">Hướng dẫn bán hàng</Link>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-text-primary dark:text-white font-bold text-lg">Liên hệ</h4>
                    <div className="flex items-center gap-3 text-text-secondary dark:text-gray-400 text-sm font-medium">
                        <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                        hotro@bookmarket.vn
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary dark:text-gray-400 text-sm font-medium">
                        <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                        1900 1234
                    </div>
                    <div className="flex gap-4 mt-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-text-secondary dark:text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-xl">public</span></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-text-secondary dark:text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-xl">share</span></a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-text-secondary dark:text-gray-500 text-sm font-medium">© 2023 BookMarket. All rights reserved.</p>
                <div className="flex gap-6">
                    <img alt="Mastercard" className="h-7 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9vKKVwB8XoSJSjlBeaC7017LNNt_SP0ArDWxTfOQovYgYPcvAx3jbsnOuPdJiQW-bdTmVo9meaSx62inC08hdnOF9yJ6a2LRRo2m60qEA2jmzEXYU_bYpMYTlZTAitf5PA35MNUsof8OwEZHBCy4wx7peNjCRHsfkTZyI_w0u5htYbRWdy1dIytWGPb3SLNKA4Uz9WTsR2jIsYintX6wJ8tJVu7hAgtrVGxL03wBCVokNiQHUjPFrCbqsC9cM0gYy0YcMk8oWlw"/>
                    <img alt="Visa" className="h-7 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvE8bhGujdYEa_tYOGNuJX9G3OPeHOYTPDBHGrZT_cVicfwmLXjAya8uVwpJor4wiAuHP9KhKqc64WGXP-0Put9A0UPJd2EWvIB-9h4oHtISxVhPApZqNZ2mlsSWFRyhhX6xf6TIBrZLMGwVmfy4md2d_4mqwjPgvQ_O092Kig-ywkdloTaMXB8ewie-x-JXWq_egcj-kbmh5LzyXOljlDD4CP6GZESbEIDSaS5cLxWARMUGtIBSqe3H4q83PkXQ2qm6cQwkbvAw"/>
                </div>
            </div>
        </div>
    </footer>
  );
}

export default Footer;