// File: src/hooks/useWallet.js
// Hook tùy chỉnh để quản lý ví và giao dịch

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Hook nạp tiền vào ví
export const useTopupWallet = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const topup = async (amount, token) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/wallet/topup`, 
                { amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { topup, loading, error };
};

// Hook lấy lịch sử giao dịch
export const useTransactionHistory = (token) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setTransactions(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [token]);

    return { transactions, loading, error };
};

// Hook mua sách
export const usePurchaseBook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const purchase = async (bookId, token) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/books/${bookId}/purchase`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { purchase, loading, error };
};