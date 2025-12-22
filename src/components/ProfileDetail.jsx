import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { Badge, IconBox, FormInput, Button } from './common';

// Helpers
const API_BASE = (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || 'http://localhost:3000';
const getToken = () => localStorage.getItem('token');

// Auth headers hook
function useAuthHeaders() {
  const token = useMemo(() => getToken(), []);
  const headers = useMemo(() => ({
    Authorization: token ? `Bearer ${token}` : undefined,
  }), [token]);
  return headers;
}

// useUserProfile: fetch user data
function useUserProfile() {
  const headers = useAuthHeaders();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError(null);
    
    // Try to get user from localStorage first
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing local user:', e);
      }
    }
    
    // If no local user or token, set default mock user
    if (!headers.Authorization) {
      console.warn('No authentication token found');
      // Set mock user for demo
      const mockUser = {
        id: 1,
        username: 'demo_user',
        name: 'Người dùng Demo',
        email: 'demo@example.com',
        phone: '0909123456',
        gender: 'male',
        dateOfBirth: { day: 15, month: 8, year: 1995 },
        avatar_url: '',
        created_at: new Date().toISOString(),
        joinDate: '01/2025'
      };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    
    // Try API call
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, { headers });
      setUser(res.data);
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to mock user on API error
      const mockUser = {
        id: 1,
        username: 'demo_user',
        name: 'Người dùng Demo',
        email: 'demo@example.com',
        phone: '0909123456',
        gender: 'male',
        dateOfBirth: { day: 15, month: 8, year: 1995 },
        avatar_url: '',
        created_at: new Date().toISOString(),
        joinDate: '01/2025'
      };
      setUser(mockUser);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { user, setUser, loading, error, refresh: fetchProfile };
}

// useAvatarUpload: avatar selection + upload
function useAvatarUpload(setUser) {
  const headers = useAuthHeaders();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onSelectFile = useCallback((f) => {
    const image = f?.[0];
    if (!image) return;
    // Validate file
    const valid = ['image/jpeg', 'image/png'];
    if (!valid.includes(image.type)) {
      setError(new Error('Chỉ hỗ trợ jpg/png'));
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      setError(new Error('Kích thước ảnh vượt 5MB'));
      return;
    }
    setError(null);
    setFile(image);
    setPreviewUrl(URL.createObjectURL(image));
  }, []);

  const upload = useCallback(async () => {
    if (!file) return null;
    setUploading(true); setError(null);
    try {
      // For demo: use preview URL as avatar (since API may not be ready)
      const avatarUrl = previewUrl;
      
      // Try API if available
      if (headers.Authorization) {
        try {
          const form = new FormData();
          form.append('file', file);
          const res = await axios.put(`${API_BASE}/api/users/me/avatar`, form, {
            headers: { ...headers, 'Content-Type': 'multipart/form-data' },
          });
          const uploadedUrl = res.data?.avatarUrl || res.data?.imageUrl || res.data?.url;
          if (uploadedUrl) {
            setUser((u) => {
              const updated = u ? { ...u, avatar_url: uploadedUrl } : u;
              localStorage.setItem('user', JSON.stringify(updated));
              return updated;
            });
            setPreviewUrl('');
            setFile(null);
            alert('Cập nhật avatar thành công!');
            return uploadedUrl;
          }
        } catch (apiErr) {
          console.warn('API upload failed, using local preview:', apiErr);
        }
      }
      
      // Fallback: save preview URL locally
      setUser((u) => {
        const updated = u ? { ...u, avatar_url: avatarUrl } : u;
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      setPreviewUrl('');
      setFile(null);
      alert('Đã lưu avatar cục bộ (API chưa sẵn sàng)');
      return avatarUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [file, headers, setUser, previewUrl]);

  return { file, previewUrl, uploading, error, onSelectFile, upload };
}

function ProfileDetail() {
  const { user, setUser, loading: profileLoading } = useUserProfile();
  const { previewUrl, uploading, error: uploadError, onSelectFile, upload } = useAvatarUpload(setUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: { day: 1, month: 1, year: 1990 },
    address: ''
  });

  // Address management
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
        dateOfBirth: user.dateOfBirth || { day: 1, month: 1, year: 1990 },
        address: user.address || ''
      });
      
      // Load addresses from localStorage or user data
      const savedAddresses = localStorage.getItem('userAddresses');
      if (savedAddresses) {
        try {
          setAddresses(JSON.parse(savedAddresses));
        } catch (e) {
          console.error('Error parsing addresses:', e);
          setAddresses([]);
        }
      } else if (user.addresses) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (part, value) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [part]: value }
    }));
  };

  // Address handlers
  const handleAddressFormChange = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressIndex(null);
    setAddressForm({ name: '', phone: '', address: '', isDefault: false });
  };

  const handleEditAddress = (index) => {
    setShowAddressForm(true);
    setEditingAddressIndex(index);
    setAddressForm(addresses[index]);
  };

  const handleSaveAddress = () => {
    if (!addressForm.name.trim() || !addressForm.phone.trim() || !addressForm.address.trim()) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    let updatedAddresses;
    if (editingAddressIndex !== null) {
      // Edit existing address
      updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = addressForm;
    } else {
      // Add new address
      updatedAddresses = [...addresses, addressForm];
    }

    // If this address is set as default, remove default from others
    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map((addr, idx) => ({
        ...addr,
        isDefault: editingAddressIndex !== null ? idx === editingAddressIndex : idx === updatedAddresses.length - 1
      }));
    }

    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', address: '', isDefault: false });
    setEditingAddressIndex(null);
  };

  const handleDeleteAddress = (index) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      const updatedAddresses = addresses.filter((_, idx) => idx !== index);
      setAddresses(updatedAddresses);
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    }
  };

  const handleSetDefaultAddress = (index) => {
    const updatedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('\n📝 Saving profile...');
      console.log('📦 Form data:', formData);
      
      const token = getToken();
      console.log('🔐 Token:', token ? 'Present' : 'Missing');
      
      if (token) {
        // Try API call if we have token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        console.log('🌐 Sending PUT /api/users/me');
        const res = await axios.put(`${API_BASE}/api/users/me`, formData, { headers });
        console.log('✅ API Response:', res.data);
      } else {
        console.log('⚠️ No token, saving locally only');
      }
      
      // Update local state and localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 Profile saved locally:', updatedUser);
      
      setIsEditing(false);
      alert('✅ Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('❌ Save error:', err.response?.data || err.message);
      // Still save locally even if API fails
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 Profile saved locally as fallback:', updatedUser);
      
      setIsEditing(false);
      alert('⚠️ Đã lưu thông tin cục bộ (API chưa sẵn sàng)');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = previewUrl || user?.avatar_url || user?.avatar || null;

  if (profileLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Đang tải hồ sơ...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Không thể tải thông tin người dùng</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
      <Header />

      {/* Main Content Wrapper */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/profile" className="hover:text-primary transition-colors">Tài khoản</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white">Hồ sơ cá nhân</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="size-12 rounded-full bg-cover bg-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xl font-bold">
                      {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{user?.name || user?.email || 'Người dùng'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Sửa hồ sơ</p>
                </div>
              </div>
              <nav className="flex flex-col p-2 gap-1">
                <Link to="/profile/detail" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                  <span className="material-symbols-outlined text-[20px] fill-1">person</span>
                  <span>Thông tin tài khoản</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  <span>Cài đặt tài khoản</span>
                </Link>
                <Link to="/profile/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  <span>Lịch sử mua hàng</span>
                </Link>
                <Link to="/profile/my-books" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  <span>Sách đang bán</span>
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span>Thông báo</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Hồ sơ của tôi</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-[18px]">{isEditing ? 'close' : 'edit'}</span>
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>
              <div className="w-full border-t border-slate-100 dark:border-slate-700 my-6"></div>
              <div className="flex flex-col-reverse md:flex-row gap-8">
                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 gap-6">
                  {/* Username */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Tên đăng nhập</label>
                    <div className="sm:col-span-2 text-slate-900 dark:text-white font-medium">{user?.username || user?.email?.split('@')[0] || 'N/A'}</div>
                  </div>
                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Tên</label>
                    <div className="sm:col-span-2">
                      <input 
                        className="w-full max-w-md rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm h-10 px-3 disabled:opacity-60 disabled:cursor-not-allowed" 
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
                    <div className="sm:col-span-2">
                      {isEditing ? (
                        <input 
                          className="w-full max-w-md rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm h-10 px-3" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          <span>{user?.email || 'N/A'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Số điện thoại</label>
                    <div className="sm:col-span-2">
                      {isEditing ? (
                        <input 
                          className="w-full max-w-md rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm h-10 px-3" 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          <span>{user?.phone || 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start pt-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 pt-1">Giới tính</label>
                    <div className="sm:col-span-2 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          checked={formData.gender === 'male'} 
                          onChange={() => handleInputChange('gender', 'male')}
                          disabled={!isEditing}
                          className="text-primary focus:ring-primary border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed" 
                          name="gender" 
                          type="radio"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Nam</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          checked={formData.gender === 'female'} 
                          onChange={() => handleInputChange('gender', 'female')}
                          disabled={!isEditing}
                          className="text-primary focus:ring-primary border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed" 
                          name="gender" 
                          type="radio"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Nữ</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          checked={formData.gender === 'other'} 
                          onChange={() => handleInputChange('gender', 'other')}
                          disabled={!isEditing}
                          className="text-primary focus:ring-primary border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed" 
                          name="gender" 
                          type="radio"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Khác</span>
                      </label>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Ngày sinh</label>
                    <div className="sm:col-span-2 flex gap-2">
                      <select 
                        className="rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary shadow-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        value={formData.dateOfBirth.day}
                        onChange={(e) => handleDateChange('day', parseInt(e.target.value))}
                        disabled={!isEditing}
                      >
                        {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>Ngày {d}</option>
                        ))}
                      </select>
                      <select 
                        className="rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary shadow-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        value={formData.dateOfBirth.month}
                        onChange={(e) => handleDateChange('month', parseInt(e.target.value))}
                        disabled={!isEditing}
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                          <option key={m} value={m}>Tháng {m}</option>
                        ))}
                      </select>
                      <select 
                        className="rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary shadow-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        value={formData.dateOfBirth.year}
                        onChange={(e) => handleDateChange('year', parseInt(e.target.value))}
                        disabled={!isEditing}
                      >
                        {Array.from({length: 100}, (_, i) => 2025 - i).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Avatar Upload Section */}
                <div className="w-full md:w-64 flex flex-col items-center gap-4 border-l border-transparent md:border-slate-100 md:dark:border-slate-700 pl-0 md:pl-8">
                  <div className="relative group">
                    <div className="size-32 rounded-full border-4 border-slate-100 dark:border-slate-700 shadow-inner overflow-hidden bg-slate-200">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-4xl font-bold">
                          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png"
                        onChange={(e) => onSelectFile(e.target.files)}
                      />
                    </label>
                  </div>
                  
                  {previewUrl && (
                    <button 
                      onClick={upload}
                      disabled={uploading}
                      className="px-4 py-2 bg-primary text-white border border-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Đang tải lên...' : 'Lưu ảnh mới'}
                    </button>
                  )}
                  
                  {uploadError && (
                    <p className="text-xs text-red-500 text-center">{uploadError.message}</p>
                  )}
                  
                  <div className="text-center px-4">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Dụng lượng file tối đa 5 MB</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Định dạng: .JPEG, .PNG</p>
                  </div>
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Thành viên từ</span>
                    <span className="text-sm font-bold text-primary">
                      {user?.created_at ? new Date(user.created_at).getFullYear() : (user?.joinDate || '2025')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full border-t border-slate-100 dark:border-slate-700 mt-8 mb-6"></div>
              {isEditing && (
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        gender: user?.gender || 'male',
                        dateOfBirth: user?.dateOfBirth || { day: 1, month: 1, year: 1990 },
                        address: user?.address || ''
                      });
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-md shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </div>

            {/* Address Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Địa chỉ giao hàng</h2>
                <button 
                  onClick={handleAddAddress}
                  className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm địa chỉ mới
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    {editingAddressIndex !== null ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Họ và tên"
                      value={addressForm.name}
                      onChange={(e) => handleAddressFormChange('name', e.target.value)}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm px-3 py-2"
                    />
                    <input
                      type="tel"
                      placeholder="Số điện thoại"
                      value={addressForm.phone}
                      onChange={(e) => handleAddressFormChange('phone', e.target.value)}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm px-3 py-2"
                    />
                    <textarea
                      placeholder="Địa chỉ đầy đủ (Số nhà, đường, phường, quận, thành phố)"
                      value={addressForm.address}
                      onChange={(e) => handleAddressFormChange('address', e.target.value)}
                      rows="3"
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-primary shadow-sm px-3 py-2"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => handleAddressFormChange('isDefault', e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Đặt làm địa chỉ mặc định</span>
                    </label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSaveAddress}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {editingAddressIndex !== null ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressIndex(null);
                        setAddressForm({ name: '', phone: '', address: '', isDefault: false });
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">location_off</span>
                    <p>Chưa có địa chỉ giao hàng nào</p>
                    <p className="text-sm mt-1">Nhấn "Thêm địa chỉ mới" để thêm địa chỉ</p>
                  </div>
                ) : (
                  addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30"
                    >
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{addr.name}</span>
                          <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600"></span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{addr.phone}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{addr.address}</p>
                        {addr.isDefault && (
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary w-fit border border-primary/20">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Sửa
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(index)}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:underline"
                          >
                            Đặt mặc định
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfileDetail;