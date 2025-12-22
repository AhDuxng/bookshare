// File: src/examples/CreateBookExample.jsx
// Component ví dụ: Đăng bán sách mới với upload ảnh lên hosting bên ngoài

import { useState } from 'react';
import { useCreateBook } from '../hooks/useCreateBook';
import { useImageUpload } from '../hooks/useImageUpload';
import { useCategories } from '../hooks/useBooks';

export function CreateBookExample() {
    const { createBook, loading, error } = useCreateBook();
    const { uploadImages, uploading, progress, error: uploadError } = useImageUpload();
    const { categories } = useCategories();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // State cho form
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category_id: '',
        description: '',
        condition: 'good'
    });

    // State cho ảnh
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý chọn ảnh (từ file input hoặc drag & drop)
    const processFiles = (files) => {
        // Lọc chỉ lấy file ảnh
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('Vui lòng chỉ chọn file ảnh!');
            return;
        }
        
        // Giới hạn tối đa 5 ảnh
        const maxFiles = 5;
        const selectedFiles = imageFiles.slice(0, maxFiles);
        
        if (imageFiles.length > maxFiles) {
            alert(`Chỉ được chọn tối đa ${maxFiles} ảnh!`);
        }
        
        setSelectedImages(selectedFiles);

        // Tạo preview
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        
        // Reset uploaded URLs khi chọn ảnh mới
        setUploadedUrls([]);
    };

    // Xử lý chọn ảnh từ file input
    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    // Xử lý drag over
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // Xử lý drag leave
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // Xử lý drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    // Xóa ảnh
    const handleRemoveImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        
        // Revoke URL để tránh memory leak
        URL.revokeObjectURL(imagePreviews[index]);
        
        // Nếu đã upload, cũng xóa URL tương ứng
        if (uploadedUrls.length > 0) {
            const newUrls = uploadedUrls.filter((_, i) => i !== index);
            setUploadedUrls(newUrls);
        }
    };

    // Upload ảnh lên hosting
    const handleUploadImages = async () => {
        if (selectedImages.length === 0) {
            alert('Vui lòng chọn ảnh trước');
            return;
        }

        try {
            const urls = await uploadImages(selectedImages);
            setUploadedUrls(urls);
            alert(`Upload thành công ${urls.length} ảnh!`);
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert('Vui lòng đăng nhập để đăng bán sách');
            return;
        }

        if (uploadedUrls.length === 0) {
            alert('Vui lòng upload ảnh trước khi đăng bán');
            return;
        }

        try {
            const bookData = {
                ...formData,
                user_id: user.id,
                price: parseFloat(formData.price)
            };

            await createBook(bookData, uploadedUrls, token);
            
            alert('Đăng bán sách thành công!');
            
            // Reset form
            setFormData({
                title: '',
                author: '',
                price: '',
                category_id: '',
                description: '',
                condition: 'good'
            });
            setSelectedImages([]);
            setImagePreviews([]);
            setUploadedUrls([]);
        } catch (err) {
            console.error('Lỗi:', err);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Đăng Bán Sách</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Upload Ảnh */}
                <div>
                    <label htmlFor="book-images" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Hình Ảnh Sách (Tối đa 5 ảnh) <span style={{ color: 'red' }}>*</span>
                    </label>
                    
                    {/* Khu vực kéo thả ảnh */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('book-images').click()}
                        style={{
                            border: isDragging ? '3px dashed #2196F3' : '2px dashed #ccc',
                            borderRadius: '10px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            backgroundColor: isDragging ? '#e3f2fd' : '#f9f9f9',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '10px'
                        }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                            {isDragging ? '📥' : '🖼️'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                            {isDragging ? 'Thả ảnh vào đây' : 'Kéo & Thả ảnh vào đây'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            hoặc <span style={{ color: '#2196F3', textDecoration: 'underline' }}>Nhấn để chọn ảnh</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                            (Tối đa 5 ảnh, định dạng: JPG, PNG, GIF)
                        </div>
                    </div>
                    
                    <input 
                        id="book-images"
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                    
                    {/* Nút upload ảnh */}
                    {selectedImages.length > 0 && uploadedUrls.length === 0 && (
                        <button
                            type="button"
                            onClick={handleUploadImages}
                            disabled={uploading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: uploading ? '#ccc' : '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                width: '100%',
                                fontSize: '16px'
                            }}
                        >
                            {uploading ? `⏳ Đang tải lên... ${progress}%` : '⬆️ Tải Ảnh Lên Server'}
                        </button>
                    )}
                    
                    {/* Hiển thị trạng thái */}
                    <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                        {selectedImages.length > 0 && uploadedUrls.length === 0 && (
                            <span>✅ {selectedImages.length} ảnh đã chọn - Nhấn "Tải Ảnh Lên"</span>
                        )}
                        {uploadedUrls.length > 0 && (
                            <span style={{ color: 'green', fontWeight: 'bold' }}>
                                ✅ Đã tải lên {uploadedUrls.length} ảnh thành công!
                            </span>
                        )}
                    </div>
                    
                    {/* Hiển thị lỗi upload */}
                    {uploadError && (
                        <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '5px' }}>
                            ❌ {uploadError}
                        </div>
                    )}
                    
                    {/* Preview ảnh */}
                    {imagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {imagePreviews.map((preview, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img 
                                        src={preview} 
                                        alt={`Preview ${index + 1}`}
                                        style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '5px', 
                                            border: uploadedUrls.length > 0 ? '2px solid green' : '2px solid #ddd'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '25px',
                                            height: '25px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ×
                                    </button>
                                    {uploadedUrls.length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            left: '0',
                                            right: '0',
                                            backgroundColor: 'rgba(0, 128, 0, 0.8)',
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px',
                                            textAlign: 'center'
                                        }}>
                                            Đã tải lên
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tiêu đề */}
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Tiêu Đề Sách <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tên sách"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>

                {/* Tác giả */}
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Tác Giả <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tên tác giả"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>

                {/* Giá & Danh mục */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Giá (VNĐ) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            placeholder="0"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Danh Mục <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tình trạng */}
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Tình Trạng Sách
                    </label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    >
                        <option value="new">Mới 100%</option>
                        <option value="like_new">Như mới (99%)</option>
                        <option value="good">Tốt</option>
                        <option value="fair">Khá</option>
                        <option value="poor">Cũ</option>
                    </select>
                </div>

                {/* Mô tả */}
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Mô Tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Mô tả chi tiết về sách..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>

                {/* Hiển thị lỗi */}
                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#ffebee', border: '1px solid #ef5350', borderRadius: '5px' }}>
                        <p style={{ color: '#c62828', margin: 0, fontWeight: 'bold' }}>{error.message}</p>
                        {error.details && error.details.length > 0 && (
                            <ul style={{ margin: '5px 0 0 20px', color: '#c62828' }}>
                                {error.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: loading ? '#ccc' : '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Đang đăng...' : 'Đăng Bán Sách'}
                </button>
            </form>
        </div>
    );
}