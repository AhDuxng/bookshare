// File: src/components/common/Badge.jsx
// Badge tái sử dụng cho status, count, label...

import React from 'react';

const Badge = ({ 
  children,
  variant = "default", // default, success, error, warning, info, primary, count
  size = "md", // sm, md, lg
  dot = false, // Hiển thị chấm tròn
  pulse = false, // Chấm có nhấp nháy không
  className = ""
}) => {
  const variantClasses = {
    default: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600",
    success: "bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    error: "bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    warning: "bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    info: "bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    primary: "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20",
    count: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] rounded",
    md: "px-2.5 py-1 text-xs rounded-full",
    lg: "px-3 py-1.5 text-sm rounded-full"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {dot && (
        <span className={`size-1.5 rounded-full ${pulse ? 'animate-pulse' : ''} ${
          variant === 'success' ? 'bg-green-500' :
          variant === 'error' ? 'bg-red-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'info' ? 'bg-blue-500' :
          'bg-slate-500'
        }`}></span>
      )}
      {children}
    </span>
  );
};

export default Badge;
