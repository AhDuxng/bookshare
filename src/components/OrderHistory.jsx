import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TabButton, PaginationButton, OrderCard } from './common';

// Custom hooks
const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try to get from localStorage first (key 'user' to match Profile.jsx)
        const cachedProfile = localStorage.getItem('user');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }

        // Then fetch from API
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading };
};

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setOrders([]);
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      // For now, show empty state if API fails
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

function OrderHistory() {
  const { profile } = useUserProfile();
  const { orders, loading } = useOrders();
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  // Get count for each status
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Default avatar and name (matching Profile.jsx pattern)
  const userAvatar = profile?.avatar_url || profile?.avatar || `https://via.placeholder.com/48?text=${(profile?.name?.[0] || profile?.username?.[0] || 'U').toUpperCase()}`;
  const userName = profile?.name || profile?.username || "Người dùng";

  const getStatusBadge = (status, text) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <span className="size-1.5 rounded-full bg-green-500"></span>
            {text}
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {text}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            <span className="size-1.5 rounded-full bg-red-500"></span>
            {text}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm" style={{backgroundImage: `url("${userAvatar}")`}}></div>
                  <div className="flex flex-col">
                    <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{userName}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Thành viên tích cực</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  <Link to="/profile/detail" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">person</span>
                    <span className="text-sm font-medium">Hồ sơ cá nhân</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">settings</span>
                    <span className="text-sm font-medium">Cài đặt tài khoản</span>
                  </Link>
                  <Link to="/profile/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-white font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-primary dark:text-white">receipt_long</span>
                    <span className="text-sm">Lịch sử mua hàng</span>
                  </Link>
                  <Link to="/profile/my-books" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">storefront</span>
                    <span className="text-sm font-medium">Sách đang bán</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">notifications</span>
                    <span className="text-sm font-medium">Thông báo</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-4">
              <ol className="flex items-center space-x-2">
                <li><Link to="/" className="text-slate-500 hover:text-primary text-sm font-medium">Trang chủ</Link></li>
                <li><span className="text-slate-500 text-sm">/</span></li>
                <li><Link to="/profile" className="text-slate-500 hover:text-primary text-sm font-medium">Tài khoản</Link></li>
                <li><span className="text-slate-500 text-sm">/</span></li>
                <li><span aria-current="page" className="text-slate-900 dark:text-white text-sm font-medium">Lịch sử mua hàng</span></li>
              </ol>
            </nav>

            {/* Page Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Lịch sử mua hàng</h1>
              <p className="text-slate-500 dark:text-gray-400">Quản lý và theo dõi trạng thái các đơn hàng sách của bạn.</p>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Tab Filters */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
                  <TabButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
                    Tất cả {statusCounts.all > 0 && `(${statusCounts.all})`}
                  </TabButton>
                  <TabButton active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')}>
                    Chờ xác nhận {statusCounts.pending > 0 && `(${statusCounts.pending})`}
                  </TabButton>
                  <TabButton active={activeFilter === 'shipping'} onClick={() => setActiveFilter('shipping')}>
                    Đang giao {statusCounts.shipping > 0 && `(${statusCounts.shipping})`}
                  </TabButton>
                  <TabButton active={activeFilter === 'delivered'} onClick={() => setActiveFilter('delivered')}>
                    Hoàn thành {statusCounts.delivered > 0 && `(${statusCounts.delivered})`}
                  </TabButton>
                  <TabButton active={activeFilter === 'cancelled'} onClick={() => setActiveFilter('cancelled')}>
                    Đã hủy {statusCounts.cancelled > 0 && `(${statusCounts.cancelled})`}
                  </TabButton>
                </div>
                {/* Search & Date Filter */}
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </span>
                    <input className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Tìm tên sách, người bán..." type="text"/>
                  </div>
                  <button className="flex items-center justify-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Order List (Cards) */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">shopping_bag</span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        Chưa có đơn hàng nào
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Bạn chưa mua sách nào. Hãy khám phá các cuốn sách hay!
                      </p>
                    </div>
                    <Link 
                      to="/browse" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined text-[20px]">storefront</span>
                      Khám phá sách
                    </Link>
                  </div>
                </div>
              ) : (
                filteredOrders.map((order, index) => (
                  <OrderCard
                    key={index}
                    orderId={order.id}
                    date={order.date}
                    bookTitle={order.bookTitle}
                    bookImage={order.bookImage}
                    bookCategory={order.bookAuthor}
                    seller={order.seller}
                    status={order.statusText}
                    statusVariant={
                      order.status === 'delivered' ? 'success' : 
                      order.status === 'shipping' ? 'info' : 
                      'danger'
                    }
                    price={order.total}
                    actions={
                      order.status === 'cancelled' ? [
                        { icon: 'replay', variant: 'default', tooltip: 'Mua lại', onClick: () => {} }
                      ] : order.status === 'delivered' ? [
                        { icon: 'visibility', variant: 'view', tooltip: 'Xem chi tiết', onClick: () => {} },
                        { icon: 'star', variant: 'default', tooltip: 'Đánh giá', onClick: () => {} }
                      ] : [
                        { icon: 'visibility', variant: 'view', tooltip: 'Xem chi tiết', onClick: () => {} },
                        { icon: 'local_shipping', variant: 'default', tooltip: 'Theo dõi', onClick: () => {} }
                      ]
                    }
                    onClick={() => console.log(`View order ${order.id}`)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between rounded-b-xl mt-6">
                <p className="text-sm text-slate-500 dark:text-gray-400 hidden sm:block">
                  Hiển thị <span className="font-medium text-slate-900 dark:text-white">1</span> đến <span className="font-medium text-slate-900 dark:text-white">{filteredOrders.length}</span> trong số <span className="font-medium text-slate-900 dark:text-white">{filteredOrders.length}</span> đơn hàng
                </p>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                  <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" disabled>
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium text-sm shadow-sm transition-colors">1</button>
                  <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderHistory;