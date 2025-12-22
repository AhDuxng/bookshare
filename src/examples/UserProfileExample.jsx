// File: src/examples/UserProfileExample.jsx
// Ví dụ: Component hiển thị hồ sơ người dùng

import { useUserProfile, useUploadAvatar } from '../hooks/useUser';
import { useState } from 'react';

export function UserProfileExample() {
    const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
    const { user, loading, error } = useUserProfile(token);
    const { uploadAvatar, loading: uploading } = useUploadAvatar();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !token) return;

        try {
            await uploadAvatar(selectedFile, token);
            alert('Upload avatar thành công!');
            setSelectedFile(null);
        } catch (err) {
            alert('Lỗi upload: ' + err.message);
        }
    };

    if (loading) return <p>Đang tải hồ sơ...</p>;
    if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Hồ Sơ Của Tôi</h2>

            {user && (
                <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                    {user.avatar_url && (
                        <img 
                            src={user.avatar_url} 
                            alt="Avatar" 
                            style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '10px' }}
                        />
                    )}

                    <div>
                        <p><strong>Tên Đăng Nhập:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Số Dư Ví:</strong> {user.balance}đ</p>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Thay Đổi Avatar</h3>
                        <input type="file" onChange={handleFileSelect} />
                        <button 
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            style={{ marginTop: '10px', padding: '10px 20px' }}
                        >
                            {uploading ? 'Đang upload...' : 'Upload Avatar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}