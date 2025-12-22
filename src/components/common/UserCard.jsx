// File: src/components/common/UserCard.jsx
// Card hiển thị thông tin người dùng/người bán

import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';

const UserCard = ({ 
  name,
  avatar,
  rating,
  joinDate,
  responseTime,
  badge,
  badgeText,
  link,
  action,
  stats = [],
  className = ""
}) => {
  const CardWrapper = link ? Link : 'div';
  const wrapperProps = link ? { to: link } : {};

  return (
    <CardWrapper 
      {...wrapperProps}
      className={`bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-soft hover:shadow-lg hover:border-primary/30 transition-all ${
        link ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                {name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          {badge && (
            <div className="absolute -bottom-1 -right-1">
              <Badge variant={badge} size="sm" dot pulse>
                {badgeText}
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1 truncate">
            {name}
          </h4>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
            {rating && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-[16px]">star</span>
                <span className="font-semibold text-slate-900 dark:text-white">{rating}</span>
              </div>
            )}
            {joinDate && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>{joinDate}</span>
              </div>
            )}
            {responseTime && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{responseTime}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{stat.label}: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action */}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default UserCard;
