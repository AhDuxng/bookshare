// File: src/hooks/useBooks.js
// Hook tùy chỉnh để quản lý sách (search, categories, authors)

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Hook tìm kiếm sách
export const useSearchBooks = (query, page = 1, limit = 10, sort = 'title') => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        axios.get(`${API_BASE_URL}/books/search`, {
            params: { query, page, limit, sort }
        })
            .then(res => {
                setBooks(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    }, [query, page, limit, sort]);

    return { books, loading, error };
};

// Hook lấy danh sách danh mục
export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/categories`)
            .then(res => {
                setCategories(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading, error };
};

// Hook lấy sách theo danh mục
export const useBooksByCategory = (slug) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        axios.get(`${API_BASE_URL}/categories/${slug}/books`)
            .then(res => {
                setBooks(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    }, [slug]);

    return { books, loading, error };
};

// Hook lấy sách theo tác giả
export const useBooksByAuthor = (authorName) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authorName) return;

        setLoading(true);
        axios.get(`${API_BASE_URL}/authors/${authorName}/books`)
            .then(res => {
                setBooks(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    }, [authorName]);

    return { books, loading, error };
};