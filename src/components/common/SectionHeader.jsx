import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ 
  title, 
  iconColor = "bg-primary", // bg-primary, bg-red-500
  badge, // { text: "Mới nhất", color: "red" }
  linkText = "Xem tất cả",
  linkTo = "#"
}) => {
  return (
    <div className="flex items-center justify-between px-2 pb-6 pt-2 border-b border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-text-primary dark:text-white text-2xl font-bold leading-tight tracking-tight flex items-center gap-3">
          <span className={`w-1.5 h-6 rounded-full ${iconColor}`}></span>
          {title}
        </h2>
        
        {badge && (
          <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold tracking-wider animate-pulse 
            ${badge.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400' : ''}
          `}>
            {badge.text}
          </span>
        )}
      </div>

      <Link 
        to={linkTo} 
        className="text-primary font-semibold text-sm hover:text-primary-dark hover:underline decoration-2 underline-offset-4 flex items-center gap-1 transition-all"
      >
        {linkText} <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </Link>
    </div>
  );
};

export default SectionHeader;