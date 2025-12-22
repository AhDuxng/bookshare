import React from 'react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-center pt-4 pb-8">
      <nav className="flex items-center gap-2">
        <a href="#" className="flex size-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-white transition-colors disabled:opacity-50">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </a>
        <a href="#" className="text-sm font-bold flex size-9 items-center justify-center text-white rounded-lg bg-primary shadow-sm shadow-blue-300 dark:shadow-none">1</a>
        <a href="#" className="text-sm font-medium flex size-9 items-center justify-center text-slate-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">2</a>
        <a href="#" className="text-sm font-medium flex size-9 items-center justify-center text-slate-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">3</a>
        <span className="text-sm font-medium flex size-9 items-center justify-center text-slate-500 dark:text-gray-400">...</span>
        <a href="#" className="text-sm font-medium flex size-9 items-center justify-center text-slate-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">10</a>
        <a href="#" className="flex size-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </a>
      </nav>
    </div>
  );
};

export default Pagination;