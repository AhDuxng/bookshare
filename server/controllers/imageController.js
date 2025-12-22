// File: server/controllers/imageController.js
// Controller: Xử lý upload ảnh lên dịch vụ bên ngoài

const axios = require('axios');
const FormData = require('form-data');

/**
 * Upload ảnh lên dịch vụ hosting bên ngoài
 * POST /api/upload-images
 */
const uploadImages = async (req, res) => {
    try {
        // Kiểm tra có file không
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                error: 'Không có ảnh nào được tải lên' 
            });
        }

        console.log(`Đang upload ${req.files.length} ảnh lên IBYTE CDN...`);

        // Giới hạn tối đa 5 ảnh
        const files = req.files.slice(0, 5);
        const uploadResults = [];

        // Upload từng ảnh lên dịch vụ bên ngoài
        for (const file of files) {
            try {
                console.log(`Upload ảnh: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
                
                const form = new FormData();
                form.append('images[]', file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
                form.append('server', 'server_1');

                const response = await axios.post('https://cfig.ibytecdn.org/upload', form, {
                    headers: {
                        ...form.getHeaders()
                    },
                    timeout: 30000,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                });

                console.log('IBYTE Response:', JSON.stringify(response.data, null, 2));

                // Lấy URL ảnh từ response
                if (response.data && response.data.results && response.data.results[0] && response.data.results[0].url) {
                    const imageUrl = response.data.results[0].url;
                    console.log(`✅ Upload thành công: ${imageUrl}`);
                    uploadResults.push({
                        success: true,
                        url: imageUrl,
                        originalName: file.originalname
                    });
                } else {
                    console.error('❌ Không nhận được URL từ IBYTE:', response.data);
                    uploadResults.push({
                        success: false,
                        error: 'Không nhận được URL từ server',
                        originalName: file.originalname
                    });
                }
            } catch (uploadError) {
                console.error(`❌ Lỗi upload ảnh ${file.originalname}:`, uploadError.response?.data || uploadError.message);
                uploadResults.push({
                    success: false,
                    error: uploadError.response?.data?.message || uploadError.message,
                    originalName: file.originalname
                });
            }
        }

        // Kiểm tra có ảnh nào upload thành công không
        const successfulUploads = uploadResults.filter(r => r.success);
        
        console.log(`Đã upload thành công ${successfulUploads.length}/${files.length} ảnh`);
        
        if (successfulUploads.length === 0) {
            return res.status(500).json({
                error: 'Không thể upload ảnh nào',
                details: uploadResults
            });
        }

        const urls = successfulUploads.map(r => r.url);
        console.log('URLs trả về:', urls);

        // Trả về kết quả
        res.json({
            message: `Upload thành công ${successfulUploads.length}/${files.length} ảnh`,
            images: uploadResults,
            urls: urls
        });

    } catch (error) {
        console.error('Lỗi upload images:', error);
        res.status(500).json({ 
            error: 'Lỗi server khi upload ảnh',
            message: error.message 
        });
    }
};

module.exports = {
    uploadImages
};
