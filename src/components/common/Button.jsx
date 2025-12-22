import React from 'react';

const Button = ({ 
  children, 
  variant = "primary", // primary, secondary, outline, white, ghost, danger
  size = "md", // sm, md, lg, icon
  className = "",
  icon,
  ...props 
}) => {
  
  const baseStyles = "flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-primary/30",
    secondary: "bg-gray-100 hover:bg-gray-200 text-text-primary dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white",
    white: "bg-white text-primary hover:bg-gray-50 shadow-black/10 hover:shadow-black/20",
    outline: "border border-gray-200 dark:border-slate-700 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 text-text-primary dark:text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-text-secondary dark:text-gray-400 shadow-none",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3.5 px-6 text-base",
    lg: "py-4 px-8 text-lg",
    icon: "p-2 rounded-full" // Dùng cho nút chỉ có icon
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};

export default Button;