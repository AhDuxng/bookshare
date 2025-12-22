// File: src/components/common/ActionButton.jsx
// Nút action nhỏ cho các thao tác (edit, delete, view...)

import React from 'react';

const ActionButton = ({ 
  icon, 
  onClick,
  variant = "default", // default, edit, delete, view, approve
  tooltip,
  disabled = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    default: "text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    edit: "text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    delete: "text-slate-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    view: "text-slate-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
    approve: "text-slate-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-full transition-all ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={tooltip}
      {...props}
    >
      <span className="material-symbols-outlined text-[20px] block leading-none">
        {icon}
      </span>
    </button>
  );
};

export default ActionButton;
