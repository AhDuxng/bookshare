// File: src/components/common/InfoCard.jsx
// Card hiển thị thông tin (địa chỉ, thanh toán, specs...)

import React from 'react';
import IconBox from './IconBox';

const InfoCard = ({ 
  icon,
  iconColor = "blue",
  title,
  subtitle,
  children,
  action,
  variant = "default", // default, highlight
  className = ""
}) => {
  return (
    <div className={`${
      variant === 'highlight'
        ? 'bg-blue-50/80 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
        : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-800'
    } rounded-xl border p-5 shadow-sm relative overflow-hidden ${className}`}>
      {variant === 'highlight' && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <IconBox icon={icon} color={iconColor} size="sm" />}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
        
        <div className="text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
