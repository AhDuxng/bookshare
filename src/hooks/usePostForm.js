// File: src/hooks/usePostForm.js
// Hook quản lý form đăng tin + lưu nháp

import { useCallback, useEffect, useRef, useState } from 'react';

const DRAFT_KEY = 'draft_post';
const API_BASE = 'http://localhost:3000/api';
const DEBOUNCE_MS = 1200;

// Mapping slug category sang ID (dự phòng nếu API không trả về)
const CATEGORY_SLUG_TO_ID = {
  fiction: 1,
  business: 2,
  skills: 3,
  comic: 4,
  textbook: 5,
};

export function usePostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: null, // Null until categories loaded
    images: [],
    status: 'draft',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const timer = useRef(null);

  // Lấy danh sách category từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          // Set category_id mặc định là category đầu tiên nếu có
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
          }
        }
      } catch (err) {
        console.warn('Không thể lấy danh sách category:', err);
        // Dùng mặc định nếu API thất bại
      }
    };
    fetchCategories();
  }, []);

  // Khôi phục nháp nếu có
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const shouldRestore = window.confirm('Tìm thấy bản nháp, bạn có muốn khôi phục?');
      if (shouldRestore) {
        try {
          setFormData(JSON.parse(draft));
        } catch (_) {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    }
  }, []);

  // Debounce auto-save draft
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [formData]);

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const setImages = useCallback((urls) => {
    setFormData(prev => ({ ...prev, images: urls }));
  }, []);

  const validate = useCallback(() => {
    if (!formData.title.trim()) return 'Tên sách không được để trống';
    const priceNum = Number(formData.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) return 'Giá phải > 0';
    // Images validation removed - handled in component before submit
    if (!formData.category_id || formData.category_id <= 0) return 'Vui lòng chọn danh mục';
    return null;
  }, [formData]);

  const submit = useCallback(async () => {
    const err = validate();
    if (err) throw new Error(err);

    setSubmitting(true);
    setMessage(null);
    try {
      // Lấy user từ localStorage
      const userStr = localStorage.getItem('user');
      let userId = null;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id;
        } catch (e) {
          console.error('Không thể parse user từ localStorage:', e);
        }
      }
      
      if (!userId) {
        throw new Error('Vui lòng đăng nhập để đăng bán sách');
      }

      const payload = {
        user_id: userId,
        title: formData.title.trim(),
        author: 'N/A',
        price: Number(formData.price),
        description: formData.description.trim(),
        image_urls: formData.images,
        status: 'published',
        category_id: Number(formData.category_id),
      };
      
      console.log('📤 Gửi payload:', payload);
      
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMsg = 'Đăng tin thất bại';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } else {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        
        console.error('❌ Lỗi từ server:', errorMsg);
        throw new Error(errorMsg);
      }
      const data = await res.json();
      localStorage.removeItem(DRAFT_KEY);
      setMessage('Đăng tin thành công!');
      return data;
    } finally {
      setSubmitting(false);
    }
  }, [formData, validate]);

  const saveDraftNow = useCallback(async () => {
    // Lưu localStorage để khôi phục nhanh
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, status: 'draft' }));
    setMessage('Đã lưu nháp');

    // Gửi draft lên backend (không cần đủ validate)
    try {
        const payload = {
            title: formData.title.trim() || 'Bản nháp chưa đặt tiêu đề',
            author: 'N/A',
            price: Number(formData.price) || 0,
            description: formData.description.trim(),
            image_urls: formData.images,
            status: 'draft',
            category_id: Number(formData.category_id) || 1,
        };
        await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        // chỉ log, không cản trở UX
        console.warn('Lưu nháp backend thất bại:', e.message);
    }
  }, [formData]);

  return {
    formData,
    updateField,
    setImages,
    submitting,
    message,
    submit,
    saveDraftNow,
    categories,
  };
}
