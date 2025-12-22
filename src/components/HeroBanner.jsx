import React, { useState, useEffect } from 'react';
import { Button } from './common';

const heroImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCwGspWhfyYygOnrqh0NaH9Lz2Vqk_0JEAXY2j6eQyi6WbSYmjW8K7N1mTbH19rxQ9GmZM0QxnfigVeyUMptvrxTqO1FISZtzOYo490ORFLtIE9yI7Hzqkv7dHqb4OQ4tZkU9aLSEnX8LRXqoGxMHgoXy6eiyN8GTl4ziwu8BIU2iybjc5Zcw6LyEO0e0q6XYbbbil_tCLwm8uwytYJ43SI4B0JyWyGWORNCh1Ivu6hFV7IqnNIjHuP2vpDcwqIF3CYobimVzLH7w",
    "https://images.unsplash.com/photo-1507842217121-9e9f1479b03d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
];

function HeroBanner() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="@container">
            <div className="flex flex-col gap-8 py-6 @[864px]:flex-row items-center justify-between max-w-[1240px] mx-auto px-4 sm:px-8">
                <div className="flex flex-col gap-6 @[864px]:max-w-[50%] @[864px]:pr-8 order-2 @[864px]:order-1">
                    <div className="flex flex-col gap-4 text-left">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm bg-blue-50 dark:bg-blue-900/30 w-fit px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">Cộng đồng yêu sách</span>
                        <h1 className="text-text-primary dark:text-white text-4xl font-black leading-[1.1] tracking-tight @[480px]:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
                            Trao đổi sách cũ, <br/><span className="text-primary relative inline-block">tìm tri thức mới
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 dark:text-yellow-600 opacity-60" fill="currentColor" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 5 Q 50 10 100 5 L 100 8 Q 50 13 0 8 Z"></path></svg>
                            </span>
                        </h1>
                        <h2 className="text-text-secondary dark:text-gray-300 text-lg font-normal leading-relaxed max-w-lg">
                            Nền tảng mua bán sách uy tín giữa cộng đồng người đọc. Khám phá kho tàng tri thức với giá tốt nhất và lan tỏa văn hóa đọc.
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" placeholder="Tìm tên sách, tác giả..." type="text"/>
                        </div>
                        <Button className="shadow-primary/30">
                            Tìm kiếm
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mt-2">
                        <span className="text-sm font-medium text-text-secondary dark:text-gray-400">Phổ biến:</span>
                        <div className="flex gap-2 flex-wrap">
                            <a className="px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-secondary dark:text-gray-300 text-sm font-medium hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm" href="#">Văn học</a>
                            <a className="px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-secondary dark:text-gray-300 text-sm font-medium hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm" href="#">Kinh tế</a>
                            <a className="px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-secondary dark:text-gray-300 text-sm font-medium hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm" href="#">Truyện tranh</a>
                        </div>
                    </div>
                </div>
                <div className="w-full @[864px]:w-1/2 relative order-1 @[864px]:order-2">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-[2rem] blur-2xl opacity-70 -z-10 transform rotate-1"></div>
                    <div 
                        className="w-full bg-center bg-no-repeat bg-cover rounded-2xl aspect-[4/3] @[864px]:aspect-[16/11] shadow-2xl shadow-blue-900/10 border-4 border-white dark:border-gray-800 transform transition-all duration-1000 ease-in-out hover:scale-[1.01]" 
                        data-alt="People reading books comfortably in a modern library setting" 
                        style={{backgroundImage: `url("${heroImages[currentImageIndex]}")`}}
                    ></div>
                    <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:-left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-50 dark:border-gray-700 flex items-center gap-4 animate-bounce-slow">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-lg text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">savings</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tiết kiệm tới</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">70% <span className="text-xs font-normal text-gray-500">giá bìa</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;