// File: src/components/common/StatCard.jsx
// Card hiển thị thống kê (rating, số sách, đơn hàng...)

import React from 'react';
import IconBox from './IconBox';
import Badge from './Badge';

const StatCard = ({ 
  icon,
  iconColor = "blue",
  title,
  value,
  suffix,
  badge,
  badgeVariant = "success",
  highlight = false,
  valueColor,
  onClick,
  className = ""
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`${highlight 
        ? 'bg-gradient-to-br from-primary to-blue-600 text-white border-blue-500' 
        : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-800/60'
      } p-5 rounded-2xl shadow-soft border flex flex-col gap-3 group hover:border-primary/30 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <IconBox 
          icon={icon} 
          color={highlight ? 'primary' : iconColor}
          className={highlight ? 'bg-white/10' : ''}
        />
        {badge && (
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        )}
      </div>
      <div>
        <p className={`${
          highlight ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
        } text-sm font-medium mb-1`}>
          {title}
        </p>
        <p className={`text-3xl font-bold ${
          valueColor || (highlight 
            ? 'text-white' 
            : 'text-slate-900 dark:text-white group-hover:text-primary'
          )
        } transition-colors`}>
          {value}
          {suffix && (
            <span className={`text-lg ${
              highlight ? 'text-white/70' : 'text-slate-400'
            } font-medium ml-1`}>
              {suffix}
            </span>
          )}
        </p>
      </div>
    </Component>
  );
};

export default StatCard;
