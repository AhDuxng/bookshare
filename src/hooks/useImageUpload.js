// File: src/hooks/useImageUpload.js
// Hook quản lý chọn ảnh, preview và upload lên server

import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export function useImageUpload() {
    const [files, setFiles] = useState([]); // File objects
    const [previews, setPreviews] = useState([]); // { url, name, uploaded, remoteUrl? }
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const revokeQueue = useRef([]);

    // Thu hồi object URLs khi unmount
    useEffect(() => {
        return () => revokeQueue.current.forEach(URL.revokeObjectURL);
    }, []);

    const reset = useCallback(() => {
        setFiles([]);
        setPreviews([]);
        setProgress(0);
        setError(null);
        revokeQueue.current.forEach(URL.revokeObjectURL);
        revokeQueue.current = [];
    }, []);

    // Nhận FileList từ input hoặc drag-drop
    const addFiles = useCallback((fileList) => {
        const incoming = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
        if (!incoming.length) return;

        const max = 5;
        const limited = incoming.slice(0, max);
        if (incoming.length > max) {
            // Không alert ở hook, để UI quyết định; nhưng vẫn cắt bớt
        }

        const nextFiles = limited;
        const nextPreviews = limited.map(f => {
            const url = URL.createObjectURL(f);
            revokeQueue.current.push(url);
            return { url, name: f.name, uploaded: false };
        });

        setFiles(nextFiles);
        setPreviews(nextPreviews);
        setError(null);
    }, []);

    const removeAt = useCallback((index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const target = prev[index];
            if (target?.url) URL.revokeObjectURL(target.url);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    // Upload tất cả ảnh, trả về URLs từ server
    const uploadAll = useCallback(async () => {
        if (!files.length) {
            setError('Vui lòng chọn ít nhất 1 ảnh');
            throw new Error('No files');
        }

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            const response = await axios.post(
                'http://localhost:3000/api/upload-images',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (evt) => {
                        if (!evt.total) return;
                        const percent = Math.round((evt.loaded * 100) / evt.total);
                        setProgress(percent);
                    }
                }
            );

            if (response.data && response.data.urls) {
                const urls = response.data.urls;
                setProgress(100);
                // Cập nhật trạng thái uploaded
                setPreviews(prev => prev.map((p, i) => ({
                    ...p,
                    uploaded: true,
                    remoteUrl: urls[i] || p.remoteUrl,
                })));
                return urls;
            }

            throw new Error('Không nhận được URL từ server');
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setUploading(false);
        }
    }, [files]);

    return {
        files,
        previews,
        uploading,
        error,
        progress,
        addFiles,
        removeAt,
        uploadAll,
        reset,
    };
}
