import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import SuccessPopup from './SuccessPopup';

function Checkout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const shippingFee = 20000; // Phí ship cố định theo thiết kế

    // State cho Form
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: user?.email || "",
        address: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showPopup, setShowPopup] = useState(false);

    // Lấy dữ liệu giỏ hàng
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        axios.get(`http://localhost:3000/api/cart?user_id=${user.id}`)
            .then(res => {
                setCartItems(res.data);
                const total = res.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                setTotalPrice(total);
            })
            .catch(err => console.error(err));
    }, [navigate, user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        const orderData = {
            user_id: user.id,
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            payment_method: paymentMethod,
            cart_items: cartItems,
            total_price: totalPrice + shippingFee
        };

        axios.post("http://localhost:3000/api/orders", orderData)
            .then(() => {
                setShowPopup(true);
            })
            .catch(err => alert("Lỗi đặt hàng: " + err.message));
    };

    const handleSuccessClose = () => {
        setShowPopup(false);
        navigate("/"); // Quay về trang chủ
    };

    if (cartItems.length === 0) {
        return <div className="text-center py-20">Đang tải hoặc giỏ hàng trống...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <SuccessPopup isOpen={showPopup} onClose={handleSuccessClose} message="Đặt hàng thành công! Cảm ơn bạn đã mua sách." buttonText="Về trang chủ" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-blue-600 font-medium mb-4">
                    Thông tin giao hàng <span className="text-gray-400 mx-2">/</span> 
                    <span className="text-gray-500">Thanh toán</span> <span className="text-gray-400 mx-2">/</span> 
                    <span className="text-gray-400">Xác nhận</span>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* CỘT TRÁI: FORM NHẬP LIỆU */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Thông tin giao hàng */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin giao hàng</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                                    <input 
                                        type="text" name="fullName" 
                                        value={formData.fullName} onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                                    <input 
                                        type="text" name="phone"
                                        value={formData.phone} onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" name="email"
                                    value={formData.email} onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                                <input 
                                    type="text" name="address"
                                    value={formData.address} onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                />
                            </div>
                        </div>

                        {/* 2. Phương thức thanh toán */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Phương thức thanh toán</h2>
                            <div className="space-y-3">
                                {/* COD */}
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" name="payment" value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-3 font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</span>
                                </label>

                                {/* Chuyển khoản */}
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'BANK' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" name="payment" value="BANK"
                                        checked={paymentMethod === 'BANK'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-3 font-medium text-gray-700">Chuyển khoản ngân hàng</span>
                                </label>

                                {/* Ví điện tử */}
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'EWALLET' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" name="payment" value="EWALLET"
                                        checked={paymentMethod === 'EWALLET'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-3 font-medium text-gray-700">Ví điện tử (Momo, ZaloPay)</span>
                                </label>
                            </div>
                        </div>

                        {/* Nút điều hướng Desktop */}
                        <div className="hidden lg:flex justify-between items-center mt-6">
                            <Link to="/cart" className="flex items-center text-blue-600 hover:underline font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Quay lại giỏ hàng
                            </Link>
                            <button 
                                onClick={handleCheckout}
                                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
                            >
                                Hoàn tất thanh toán
                            </button>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Đơn hàng của bạn</h2>
                            
                            {/* List items */}
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.cart_id} className="flex gap-3">
                                        <div className="w-16 h-20 bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-800">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tính tiền */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium">{totalPrice.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-medium">{shippingFee.toLocaleString()}đ</span>
                                </div>
                            </div>

                            {/* Tổng cộng */}
                            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                <span className="text-2xl font-extrabold text-blue-600">{(totalPrice + shippingFee).toLocaleString()}đ</span>
                            </div>

                            {/* Nút Mobile */}
                            <div className="mt-6 lg:hidden">
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                                >
                                    Hoàn tất thanh toán
                                </button>
                                <Link to="/cart" className="block text-center text-blue-600 mt-4 text-sm hover:underline">
                                    Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;