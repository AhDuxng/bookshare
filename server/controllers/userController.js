const userService = require('../services/userService');
const axios = require('axios');
const FormData = require('form-data');

// Lấy thông tin hồ sơ người dùng
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await userService.getUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật thông tin profile (name, email, phone, gender, address)
exports.updateProfile = async (req, res) => {
    try {
        console.log('\n📝 Update profile endpoint called');
        
        const userId = req.user?.id;
        console.log('👤 User ID:', userId);
        
        if (!userId) {
            console.log('❌ Missing user ID');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updateData = req.body;
        console.log('📦 Update data:', updateData);

        const updatedUser = await userService.updateProfile(userId, updateData);
        
        console.log('✅ Profile updated successfully');
        res.json(updatedUser);
    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
    try {
        console.log('\n📤 Avatar upload endpoint called');
        console.log('👤 User ID:', req.user?.id);
        console.log('📁 File info:', req.file ? { name: req.file.originalname, size: req.file.size, mime: req.file.mimetype } : 'NO FILE');
        
        const userId = req.user?.id;
        if (!userId) {
            console.log('❌ Missing user ID');
            return res.status(401).json({ error: 'Unauthorized: Please login' });
        }

        const file = req.file;
        if (!file) {
            console.log('❌ No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('📤 Starting upload to IBYTE CDN...');
        
        try {
            // Upload to IBYTE CDN using same method as book images
            const form = new FormData();
            form.append('images[]', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype
            });
            form.append('server', 'server_1');

            const response = await axios.post('https://cfig.ibytecdn.org/upload', form, {
                headers: { ...form.getHeaders() },
                timeout: 30000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            console.log('📡 IBYTE Response:', JSON.stringify(response.data));
            
            const avatarUrl = response?.data?.results?.[0]?.url;
            if (!avatarUrl) {
                console.error('❌ Không nhận được URL từ IBYTE:', response.data);
                return res.status(500).json({ error: 'Upload ảnh thất bại, vui lòng thử lại' });
            }

            console.log('✅ Upload thành công:', avatarUrl);

            // Lưu avatar_url vào database
            console.log('💾 Saving to database... (User ID:', userId, ', URL:', avatarUrl, ')');
            const updatedUser = await userService.updateAvatar(userId, avatarUrl);
            console.log('✅ Database updated:', updatedUser);
            
            res.json({ 
                avatarUrl, 
                user: updatedUser,
                message: 'Avatar updated successfully'
            });
        } catch (uploadErr) {
            console.error('❌ IBYTE upload error:', uploadErr.response?.data || uploadErr.message);
            return res.status(500).json({ 
                error: 'Không thể upload ảnh lên CDN',
                details: uploadErr.message
            });
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ error: error.message });
    }
};