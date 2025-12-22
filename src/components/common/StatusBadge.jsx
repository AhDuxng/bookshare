import React from 'react';

const StatusBadge = ({ status, text, className = "" }) => {
  const statusStyles = {
    active: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-500",
    sold: "bg-gray-100 text-gray-600 ring-gray-500/10 dark:bg-gray-700 dark:text-gray-400",
    shipping: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400",
  };

  const style = statusStyles[status] || statusStyles.active;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style} ${className}`}>
      {text}
    </span>
  );
};

export default StatusBadge;