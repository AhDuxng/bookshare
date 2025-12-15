import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Lấy dữ liệu giỏ hàng thật từ Server
  useEffect(() => {
    if (!user) {
        alert("Vui lòng đăng nhập để xem giỏ hàng");
        navigate("/login");
        return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = () => {
    axios.get(`http://localhost:3000/api/cart?user_id=${user.id}`)
      .then(res => {
        setCartItems(res.data);
      })
      .catch(err => console.error("Lỗi lấy giỏ hàng:", err));
  };

  // 2. Tính tổng tiền tự động
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [cartItems]);

  // 3. Cập nhật số lượng (Gọi API PUT)
  const handleQuantityChange = (cartId, value) => {
    const newQuantity = parseInt(value);
    if (newQuantity < 1) return;

    axios.put(`http://localhost:3000/api/cart/${cartId}`, { quantity: newQuantity })
      .then(() => {
        // Cập nhật state local ngay lập tức để giao diện mượt mà
        const updatedCart = cartItems.map(item => 
            item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
      })
      .catch(err => console.error("Lỗi cập nhật:", err));
  };

  // 4. Xóa sản phẩm (Gọi API DELETE)
  const handleRemoveItem = (cartId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;

    axios.delete(`http://localhost:3000/api/cart/${cartId}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item.cart_id !== cartId));
      })
      .catch(err => console.error("Lỗi xóa:", err));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        <div className="mb-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-700">Giỏ hàng</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Giỏ hàng của bạn <span className="text-gray-500 font-normal text-2xl">({cartItems.length} sản phẩm)</span>
        </h1>

        {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-xl text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Tiếp tục mua sắm</Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: DANH SÁCH */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">Giá</div>
                            <div className="col-span-2 text-center">Số lượng</div>
                            <div className="col-span-2 text-center">Tổng</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className="grid grid-cols-12 gap-4 p-4 items-center">
                                    
                                    <div className="col-span-6 flex gap-4">
                                        <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500">bởi {item.author || "Đang cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center text-gray-600 font-medium">
                                        {item.price.toLocaleString()}đ
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <input 
                                            type="number" 
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.cart_id, e.target.value)}
                                            className="w-16 border border-gray-300 rounded-md p-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2 flex items-center justify-between pl-4">
                                        <span className="font-bold text-gray-900">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </span>
                                        <button 
                                            onClick={() => handleRemoveItem(item.cart_id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                            title="Xóa sản phẩm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <Link to="/" className="flex items-center text-blue-600 font-semibold hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>

                {/* CỘT PHẢI: THANH TOÁN (Giữ nguyên giao diện) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{totalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="text-xs italic text-gray-400">Sẽ được tính ở bước sau</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                                <span className="font-bold text-gray-900 text-xl">{totalPrice.toLocaleString()}đ</span>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-0.5" 
                           onClick={() => navigate("/checkout")}
                        >
                            Tiến hành Thanh toán
                        </button>
                    </div>
                </div>

            </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;