import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useImageUpload } from '../hooks/useImageUpload';
import { usePostForm } from '../hooks/usePostForm';
import { PostPreview } from './PostPreview';
import { ModalPopup } from './ModalPopup';
import { IconBox, FormInput, FormSelect, FormTextarea } from './common';

function AddBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    files,
    previews,
    uploading,
    progress,
    error: uploadError,
    addFiles,
    removeAt,
    uploadAll,
  } = useImageUpload();

  const {
    formData,
    updateField,
    setImages,
    submitting,
    message,
    submit,
    saveDraftNow,
    categories,
  } = usePostForm();

  const [isDragging, setIsDragging] = useState(false);
  const [popup, setPopup] = useState({ open: false, type: 'info', title: '', message: '' });
  const [redirectId, setRedirectId] = useState(null);

  // Nhận dữ liệu từ trang xem trước để điền lại form
  useEffect(() => {
    const incoming = location.state?.draft;
    if (incoming) {
      updateField('title', incoming.title || '');
      updateField('description', incoming.description || '');
      updateField('price', incoming.price || '');
      if (incoming.images?.length) {
        setImages(incoming.images);
      }
    }
  }, [location.state, setImages, updateField]);

  // Đồng bộ ảnh đã upload vào form
  useEffect(() => {
    const uploaded = previews.filter(p => p.remoteUrl).map(p => p.remoteUrl);
    if (uploaded.length) {
      setImages(uploaded);
    }
  }, [previews, setImages]);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const filesDropped = e.dataTransfer.files;
    if (filesDropped && filesDropped.length > 0) {
      addFiles(filesDropped);
    }
  };

  const handleRemoveImage = (index) => {
    removeAt(index);
  };

  const handleUploadImages = async () => {
    if (!files.length) {
      setPopup({ open: true, type: 'info', title: 'Chưa chọn ảnh', message: 'Vui lòng thêm ít nhất 1 ảnh trước khi tải lên.' });
      return;
    }
    try {
      const urls = await uploadAll();
      setImages(urls);
      setPopup({ open: true, type: 'success', title: 'Upload thành công', message: `Đã tải lên ${urls.length} ảnh.` });
    } catch (err) {
      console.error('Lỗi upload:', err);
      setPopup({ open: true, type: 'error', title: 'Upload thất bại', message: err.message || 'Vui lòng thử lại.' });
    }
  };

  const handlePublish = async () => {
    try {
      let uploadedUrls = formData.images || [];
      
      // Kiểm tra xem có file nào được chọn không
      if (files.length > 0) {
        // Kiểm tra xem có ảnh nào chưa upload không
        const hasUnuploadedImages = previews.some(p => !p.remoteUrl);
        
        if (hasUnuploadedImages) {
          setPopup({ open: true, type: 'info', title: 'Đang tải ảnh', message: 'Vui lòng chờ trong khi chúng tôi tải ảnh lên...' });
          try {
            const urls = await uploadAll();
            console.log('✅ Upload thành công, URLs:', urls);
            if (!urls || urls.length === 0) {
              throw new Error('Không nhận được URL sau khi upload');
            }
            // Lưu URLs vào biến local và set vào form
            uploadedUrls = urls;
            setImages(urls);
          } catch (uploadErr) {
            setPopup({ open: false });
            throw new Error('Upload ảnh thất bại: ' + uploadErr.message);
          }
          setPopup({ open: false });
        } else {
          // Nếu đã upload rồi, lấy từ previews
          uploadedUrls = previews.filter(p => p.remoteUrl).map(p => p.remoteUrl);
          if (uploadedUrls.length === 0) {
            uploadedUrls = formData.images;
          }
        }
      }
      
      // Kiểm tra uploadedUrls thay vì formData.images (tránh race condition)
      if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error('Cần ít nhất 1 ảnh. Vui lòng tải ảnh lên trước.');
      }

      // Đảm bảo formData có images trước khi submit
      if (formData.images.length === 0) {
        setImages(uploadedUrls);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log('📤 Đang gửi form với images:', uploadedUrls);
      const res = await submit();
      if (res?.id) {
        setRedirectId(res.id);
      }
      setPopup({ open: true, type: 'success', title: 'Đăng tin thành công', message: 'Tin của bạn đã được đăng. Chúng tôi sẽ chuyển bạn tới trang chi tiết.' });
    } catch (err) {
      console.error('❌ Lỗi đăng tin:', err);
      setPopup({ open: true, type: 'error', title: 'Không thể đăng tin', message: err.message || 'Vui lòng kiểm tra lại thông tin.' });
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Kiểm tra xem có ảnh nào cần upload không
      const hasUnuploadedImages = files.length > 0 && previews.some(p => !p.remoteUrl);
      
      if (hasUnuploadedImages) {
        setPopup({ open: true, type: 'info', title: 'Đang tải ảnh', message: 'Vui lòng chờ trong khi chúng tôi tải ảnh lên...' });
        const urls = await uploadAll();
        if (urls && urls.length > 0) {
          setImages(urls);
        }
      } else if (files.length > 0 && !formData.images.length) {
        // Nếu có file chưa được upload và form cũng không có ảnh
        setPopup({ open: true, type: 'info', title: 'Đang tải ảnh', message: 'Vui lòng chờ trong khi chúng tôi tải ảnh lên...' });
        const urls = await uploadAll();
        if (urls && urls.length > 0) {
          setImages(urls);
        }
      }

      await saveDraftNow();
      setPopup({ open: true, type: 'success', title: 'Đã lưu nháp', message: 'Bài viết của bạn đã được lưu. Bạn có thể quay lại chỉnh sửa bất cứ lúc nào.' });
    } catch (err) {
      setPopup({ open: true, type: 'error', title: 'Lỗi lưu nháp', message: err.message || 'Vui lòng thử lại.' });
    }
  };

  const handlePreview = () => {
    const data = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      images: formData.images.length ? formData.images : previews.map(p => p.url),
    };
    navigate('/preview', { state: { draft: data } });
  };

  const closePopup = () => {
    const wasSuccess = popup.type === 'success' && popup.title === 'Đăng tin thành công';
    setPopup(prev => ({ ...prev, open: false }));
    
    if (wasSuccess) {
      // Chuyển đến trang danh mục sau khi đăng tin thành công
      navigate('/browse');
    } else if (redirectId) {
      navigate(`/book/${redirectId}`);
      setRedirectId(null);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary font-display">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-6 top-1 w-1 h-10 bg-primary rounded-r-full hidden lg:block"></div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Đăng tin bán sách</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Chia sẻ tri thức, kết nối đam mê đọc sách.</p>
            </div>

            {/* Image Upload Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <IconBox icon="image" color="primary" />
                Hình ảnh sản phẩm
              </h3>
              
              <input 
                id="book-images-input"
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('book-images-input').click()}
                className="border-2 border-dashed border-blue-200 dark:border-slate-700 bg-soft-blue/50 dark:bg-slate-800/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-soft-blue dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
                style={{
                  borderColor: isDragging ? '#2196F3' : undefined,
                  backgroundColor: isDragging ? '#e3f2fd' : undefined
                }}
              >
                <div className="size-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-[32px]">cloud_upload</span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                  {isDragging ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">hoặc <span className="text-primary font-medium underline underline-offset-2">duyệt qua thiết bị</span></p>
                <p className="text-xs text-slate-400 mt-3 bg-white dark:bg-slate-700 px-3 py-1 rounded-full">Hỗ trợ JPG, PNG, tối đa 5 ảnh</p>
              </div>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {previews.map((preview, index) => (
                  <div key={index} className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-600 shadow-md group">
                    <img className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={`Ảnh ${index + 1}`} src={preview.url}/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1.5 right-1.5 bg-white/90 dark:bg-slate-800/90 text-red-500 hover:text-red-600 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 translate-y-2 group-hover:translate-y-0"
                    >
                      <span className="material-symbols-outlined text-[16px] block">close</span>
                    </button>
                    {preview.remoteUrl && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500/90 text-white text-[10px] py-1 text-center font-bold">
                        ✓ Đã upload
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Book Details Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <IconBox icon="edit_note" color="primary" />
                Thông tin chi tiết
              </h3>
              
              <div className="space-y-6">
                <FormInput
                  label="Tiêu đề sách"
                  required
                  placeholder="Nhập tên sách chính xác trên bìa"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">Tác giả <span className="text-red-500">*</span></label>
                    <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 px-4 placeholder:text-slate-400 transition-all" placeholder="Tên tác giả" type="text"/>
                  </div>
                  <div className="group">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">Nhà xuất bản (Tùy chọn)</label>
                    <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 px-4 placeholder:text-slate-400 transition-all" placeholder="Ví dụ: NXB Trẻ" type="text"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">Thể loại <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        className="form-select w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 pl-4 pr-10 appearance-none transition-all cursor-pointer"
                        value={formData.category_id}
                        onChange={(e) => updateField('category_id', e.target.value)}
                      >
                        {categories.length > 0 ? (
                          categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="1">Văn học - Tiểu thuyết</option>
                            <option value="2">Kinh tế - Kinh doanh</option>
                            <option value="3">Kỹ năng sống</option>
                            <option value="4">Truyện tranh</option>
                            <option value="5">Sách giáo khoa</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">Năm xuất bản</label>
                    <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 px-4 placeholder:text-slate-400 transition-all" placeholder="Ví dụ: 2023" type="number"/>
                  </div>
                </div>

                <FormTextarea
                  label="Mô tả sản phẩm"
                  placeholder="Tóm tắt nội dung sách, tình trạng chi tiết (có ghi chú, gập góc, ô vàng không?)..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={5}
                />
              </div>
            </div>

            {/* Condition & Price Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <IconBox icon="sell" color="primary" />
                Tình trạng & Giá bán
              </h3>
              
              <div className="space-y-6">
                <div>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-3 block">Tình trạng sách <span className="text-red-500">*</span></span>
                  <div className="flex flex-wrap gap-3">
                    <label className="cursor-pointer group">
                      <input className="peer sr-only" name="condition" type="radio" value="new"/>
                      <div className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 transition-all text-sm font-medium hover:border-primary/50">
                        Mới 100%
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input defaultChecked className="peer sr-only" name="condition" type="radio" value="like_new"/>
                      <div className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 transition-all text-sm font-medium hover:border-primary/50">
                        Như mới (99%)
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="peer sr-only" name="condition" type="radio" value="good"/>
                      <div className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 transition-all text-sm font-medium hover:border-primary/50">
                        Đã qua sử dụng
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="peer sr-only" name="condition" type="radio" value="old"/>
                      <div className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 transition-all text-sm font-medium hover:border-primary/50">
                        Sách cũ
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block relative group">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">Giá bìa (VNĐ)</span>
                    <div className="relative">
                      <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 pl-4 pr-12 placeholder:text-slate-400 transition-all" placeholder="0" type="text"/>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">đ</div>
                    </div>
                  </label>
                  <label className="block relative group">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2 block">Giá muốn bán (VNĐ) <span className="text-red-500">*</span></span>
                    <div className="relative">
                      <input
                        className="form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-blue-50/50 dark:bg-blue-900/10 text-primary font-bold text-lg focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 pl-4 pr-12 placeholder:text-slate-400 transition-all"
                        placeholder="0"
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm font-bold pointer-events-none">đ</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex lg:hidden items-center gap-4 pt-4 pb-8">
              <button
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:bg-slate-400"
                onClick={handlePublish}
                disabled={submitting || uploading}
              >
                {submitting ? 'Đang đăng...' : 'Đăng tin ngay'}
              </button>
              <button
                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={handleSaveDraft}
                disabled={submitting || uploading}
              >
                Lưu nháp
              </button>
            </div>
          </div>

          {/* Right Column: Tips & Preview */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-surface-dark dark:to-slate-800/30 rounded-2xl p-6 shadow-soft border border-blue-100/50 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-600">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Mẹo bán nhanh</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Hình ảnh rõ nét</p>
                    <p className="text-xs text-slate-500 mt-1">Đăng ảnh thật, đủ sáng giúp người mua tin tưởng hơn.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mô tả chi tiết</p>
                    <p className="text-xs text-slate-500 mt-1">Hãy trung thực về các lỗi nhỏ của sách (nếu có).</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Giá hợp lý</p>
                    <p className="text-xs text-slate-500 mt-1">Tham khảo giá sách cũ cùng loại để đưa ra mức giá tốt.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Preview Card */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-800 opacity-70 pointer-events-none select-none hidden md:block">
              <h4 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">preview</span>
                Xem trước hiển thị
              </h4>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                const seller = user ? {
                  name: user.username || user.name || user.email || 'Bạn',
                  avatar: user.avatar_url || user.avatar || null,
                  initial: (user.username || user.name || 'B').charAt(0).toUpperCase()
                } : { name: 'Bạn' };
                return (
                  <PostPreview
                    title={formData.title}
                    description={formData.description}
                    price={formData.price}
                    images={formData.images.length ? formData.images : previews.map(p => p.url)}
                    seller={seller}
                  />
                );
              })()}
            </div>

            {/* Sticky Action Buttons (Desktop) */}
            <div className="hidden lg:block sticky top-24 z-10">
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-soft border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-400"
                    onClick={handlePublish}
                    disabled={submitting || uploading}
                  >
                    <span className="material-symbols-outlined">send</span>
                    {submitting ? 'Đang đăng...' : 'Đăng tin ngay'}
                  </button>
                  <button
                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={handleSaveDraft}
                    disabled={submitting || uploading}
                  >
                    Lưu nháp
                  </button>
                  <button
                    className="w-full text-slate-500 dark:text-slate-400 font-medium py-2 px-6 rounded-xl hover:text-primary transition-colors text-sm flex items-center justify-center gap-2"
                    onClick={handlePreview}
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    Xem trước
                  </button>
                </div>
                <p className="text-xs text-center text-slate-400 mt-5 leading-relaxed">
                  Bằng việc đăng tin, bạn đồng ý với <a href="#" className="text-primary hover:underline decoration-primary/50">Quy định đăng tin</a> của chúng tôi.
                </p>
                {message && (
                  <p className="text-xs text-center text-green-600 dark:text-green-400 mt-3">{message}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      <ModalPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />
    </div>
  );
}

export default AddBook;