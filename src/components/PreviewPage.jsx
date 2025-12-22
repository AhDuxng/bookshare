// File: src/components/PreviewPage.jsx
// Trang xem trước bài đăng, nhận dữ liệu qua location state

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PostPreview } from './PostPreview';
import Button from './common/Button';

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.draft;

  // Nếu không có dữ liệu, quay lại trang đăng
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-lg text-slate-700 mb-4">Không tìm thấy dữ liệu xem trước.</p>
        <Button onClick={() => navigate('/add-book')}>Quay lại đăng tin</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Xem trước bài đăng</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{data.title || 'Tiêu đề chưa có'}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại chỉnh sửa</Button>
            <Button onClick={() => navigate('/add-book', { state: { draft: data } })}>
              Đăng ngay
            </Button>
          </div>
        </div>
        <PostPreview {...data} />
      </div>
    </div>
  );
}
