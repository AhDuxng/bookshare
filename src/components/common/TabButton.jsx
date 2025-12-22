// File: src/components/common/TabButton.jsx
// Nút tab và filter button

import React from 'react';

export const TabButton = ({ 
  children,
  active = false,
  onClick,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? 'bg-white dark:bg-slate-700 text-primary dark:text-blue-400 shadow-sm' 
          : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const FilterButton = ({ 
  children,
  active = false,
  count,
  onClick,
  icon,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-primary text-white shadow-md shadow-primary/30' 
          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
      } ${className}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
      {count !== undefined && (
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
          active 
            ? 'bg-white/20' 
            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

export const PaginationButton = ({ 
  children,
  active = false,
  disabled = false,
  onClick,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`size-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active 
          ? 'bg-primary text-white shadow-md shadow-primary/30' 
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary border border-slate-200 dark:border-slate-600'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default TabButton;
