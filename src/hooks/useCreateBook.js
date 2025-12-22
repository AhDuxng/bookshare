// File: src/hooks/useCreateBook.js
// Hook React để đăng bán sách mới

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const useCreateBook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBook = async (bookData, imageUrls, token) => {
        setLoading(true);
        setError(null);

        try {
            // Gửi dữ liệu JSON với URLs ảnh
            const response = await axios.post(`${API_BASE_URL}/books`, {
                title: bookData.title,
                author: bookData.author,
                price: bookData.price,
                category_id: bookData.category_id,
                description: bookData.description || null,
                condition: bookData.condition || 'good',
                user_id: bookData.user_id,
                image_urls: imageUrls // Mảng URLs ảnh đã upload
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            setLoading(false);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            const errorDetails = err.response?.data?.details || [];
            
            setError({
                message: errorMessage,
                details: errorDetails
            });
            setLoading(false);
            throw err;
        }
    };

    return { createBook, loading, error };
};

// Hook lấy sách của người dùng
export const useUserBooks = (userId, token) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/users/${userId}/books`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => {
                setBooks(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.response?.data?.error || err.message);
            })
            .finally(() => setLoading(false));
    }, [userId, token]);

    return { books, loading, error, refetch: () => setLoading(true) };
};