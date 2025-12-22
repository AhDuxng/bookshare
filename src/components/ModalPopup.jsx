// File: src/components/ModalPopup.jsx
// Popup tái sử dụng cho thông báo thành công / thất bại

import React from 'react';

export function ModalPopup({ open, type = 'info', title, message, onClose, primaryLabel = 'Đóng' }) {
  if (!open) return null;

  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${colors[type] || colors.info}`}>
          {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
