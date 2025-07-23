// File: src/app/dashboard/orders/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/utils/auth'; // Ensure this is the async version
import ordersData from '@/data/orders.json'; // Assuming this is still correct path for your orders data
import { FaBoxOpen, FaShoppingCart, FaSpinner, FaChevronRight, FaRegClock, FaCheckCircle, FaHourglassHalf, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

interface Order {
  id: number;
  user_email: string;
  product: string;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Cancelled'; // Added Cancelled for more variety
  date: string;
  totalAmount: number; // Added for more comprehensive order data
  itemsCount: number;  // Added for more comprehensive order data
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent'); // For recent vs all orders
  const [searchQuery, setSearchQuery] = useState(''); // Search functionality

  // You need to import `useRef` and `useCallback` if you were to implement
  // totalUnreadMessages here as well, similar to messages/page.tsx.
  // For simplicity, we'll just pass 0 or define a placeholder for now.
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0); // Add state for totalUnreadMessages

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const user = await getCurrentUser(); // Await the async getCurrentUser
      if (user && user.email) {
        setUserEmail(user.email);
        // Cast ordersData to Order[] for better type inference
        const allOrders: Order[] = ordersData as Order[];
        const filteredOrders = allOrders.filter(
          (order) => order.user_email === user.email
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
        setOrders(filteredOrders);
        // In a real app, you might fetch actual unread message count here
        // For now, we'll keep it at 0 or a value fetched from a global state/context
        // setTotalUnreadMessages(someGlobalUnreadCount);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []); // Empty dependency array, runs once on mount

  const statusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'Processing':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Pending':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Cancelled': // Added color for Cancelled
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case 'Processing':
        return <FaHourglassHalf className="text-blue-500 mr-1" />;
      case 'Pending':
        return <FaRegClock className="text-orange-500 mr-1" />;
      case 'Cancelled':
        return <FaRegClock className="text-red-500 mr-1" />; // Or a different icon for cancelled
      default:
        return null;
    }
  };

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) {
      return orders;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return orders.filter(order =>
      order.product.toLowerCase().includes(lowerCaseQuery) ||
      order.id.toString().includes(lowerCaseQuery) ||
      order.status.toLowerCase().includes(lowerCaseQuery)
    );
  }, [orders, searchQuery]);


  // Helper function to format currency (assuming Naira)
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  return (
    // Pass the required prop here
    <DashboardLayout totalUnreadMessages={totalUnreadMessages}>
      <div className="space-y-8 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-64px)] animate-fadeIn">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-slideInUp">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <FaBoxOpen className="text-[#775522] text-4xl" /> My Orders
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8CEB0] text-[#775522] text-sm font-semibold rounded-full shadow-md hover:bg-[#D4BC9F] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
          >
            <FaShoppingCart className="text-lg group-hover:rotate-6 transition-transform duration-300" />
            Continue Shopping
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100 animate-pulse-fast">
            <FaSpinner className="animate-spin text-[#775522] text-4xl mb-4" />
            <p className="text-lg text-gray-600">Loading your orders...</p>
          </div>
        ) : (
          <>
            {/* No Orders Yet */}
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100 animate-scaleIn">
                <p className="text-2xl text-gray-700 font-semibold mb-3">No orders yet!</p>
                <p className="text-md text-gray-500 mb-6">
                  It looks like you haven't made any purchases.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#775522] text-white text-base font-bold rounded-lg shadow-xl hover:bg-[#5E441B] transition-all duration-300 transform hover:scale-105"
                >
                  <FaShoppingCart className="text-xl" /> Start Shopping Now
                </Link>
              </div>
            ) : (
              <>
                {/* Tabs for Recent vs All Orders */}
                <div className="flex justify-center mb-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                  <div className="inline-flex rounded-full shadow-md bg-white p-1">
                    <button
                      onClick={() => setActiveTab('recent')}
                      className={`px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                        activeTab === 'recent'
                          ? 'bg-[#775522] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Recent Orders
                    </button>
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                        activeTab === 'all'
                          ? 'bg-[#775522] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Orders ({orders.length})
                    </button>
                  </div>
                </div>

                {/* Search Bar (Only for 'All Orders' tab) */}
                {activeTab === 'all' && (
                  <div className="mb-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="relative flex items-center">
                      <FaSearch className="absolute left-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by product, ID, or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#775522] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                )}

                {/* Orders List */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                  {(activeTab === 'recent' ? recentOrders : filteredOrders).map((order, index) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-[#E8CEB0] transform hover:-translate-y-1 animate-scaleIn"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            {order.product}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-medium text-gray-700">{order.id}</span></p>
                          <p className="text-sm text-gray-500">Date: <span className="font-medium text-gray-700">{order.date}</span></p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-4 border-t border-gray-100 pt-3 mt-3">
                        <p className="text-gray-600">Items: <span className="font-semibold">{order.itemsCount}</span></p>
                        <p className="text-lg font-bold text-[#775522]">
                          Total: {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 bg-[#e4c79d] text-white-700 rounded-lg text-sm font-semibold hover:bg-gray-500 transition-colors duration-200 shadow-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                  {(activeTab === 'all' && filteredOrders.length === 0 && searchQuery) && (
                    <p className="text-center text-gray-500 py-6 col-span-full">No orders found matching your search query.</p>
                  )}
                </div>

                {/* View All Orders Button (if recent tab is active and there are more orders) */}
                {activeTab === 'recent' && orders.length > 3 && (
                  <div className="text-center mt-8 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#775522] text-white text-base font-semibold rounded-lg shadow-md hover:bg-[#5E441B] transition-all duration-300 transform hover:scale-105 group"
                    >
                      View All Orders <FaChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

const getParticipantEmail = (conversation: any, currentUserEmail: string) => {
  return conversation.participants.find((p: string) => p !== currentUserEmail) || '';
};