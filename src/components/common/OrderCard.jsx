// File: src/components/common/OrderCard.jsx
// Card hiển thị đơn hàng

import React from 'react';
import Badge from './Badge';
import ActionButton from './ActionButton';

const OrderCard = ({ 
  orderId,
  date,
  bookTitle,
  bookImage,
  bookCategory,
  seller,
  status,
  statusVariant = "default",
  price,
  actions = [],
  onClick,
  className = ""
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:border-primary/30 hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Header: Order ID, Date, Status */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {orderId}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {date}
          </span>
        </div>
        <Badge variant={statusVariant}>
          {status}
        </Badge>
      </div>

      {/* Book Info */}
      <div className="flex gap-4 mb-4">
        {bookImage && (
          <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src={bookImage} alt={bookTitle} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">
            {bookTitle}
          </h4>
          {bookCategory && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {bookCategory}
            </p>
          )}
          {seller && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Người bán: <span className="font-medium">{seller}</span>
            </p>
          )}
        </div>
      </div>

      {/* Footer: Price and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="text-right font-bold text-slate-900 dark:text-white">
          {price}
        </div>
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, idx) => (
              <ActionButton
                key={idx}
                icon={action.icon}
                variant={action.variant}
                tooltip={action.tooltip}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
