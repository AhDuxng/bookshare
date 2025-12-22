// File: src/components/common/IconBox.jsx
// Hộp icon tái sử dụng với background màu

import React from 'react';

const IconBox = ({ 
  icon, 
  color = "blue", // blue, green, red, orange, purple, amber
  size = "md", // sm, md, lg
  className = "" 
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    primary: "bg-blue-50 dark:bg-blue-900/20 text-primary"
  };

  const sizeClasses = {
    sm: "p-1.5 rounded-lg",
    md: "p-2 rounded-lg",
    lg: "p-3 rounded-xl"
  };

  const iconSizes = {
    sm: "text-[18px]",
    md: "text-[24px]",
    lg: "text-[32px]"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <span className={`material-symbols-outlined ${iconSizes[size]} block leading-none`}>
        {icon}
      </span>
    </div>
  );
};

export default IconBox;
