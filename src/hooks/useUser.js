// File: src/hooks/useUser.js
// Hook tùy chỉnh để quản lý người dùng (profile, avatar, auth)

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Hook lấy hồ sơ người dùng
export const useUserProfile = (token) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [token]);

    return { user, loading, error };
};

// Hook upload avatar
export const useUploadAvatar = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadAvatar = async (file, token) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const res = await axios.post(`${API_BASE_URL}/users/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { uploadAvatar, loading, error };
};

// Hook đăng ký
export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/register`, {
                username,
                email,
                password
            });

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
};

// Hook đăng nhập
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, {
                username,
                password
            });

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};