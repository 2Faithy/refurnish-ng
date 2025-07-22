'use client';

import { FaUserEdit, FaPlusCircle, FaCog, FaBoxOpen, FaLightbulb } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import VerifyPrompt from '@/components/VerifyPrompt';
import { getCurrentUser } from '@/utils/auth'; 
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [hasMoreOrders, setHasMoreOrders] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false); 

  useEffect(() => {
    const currentUser = getCurrentUser(); 
    setUser(currentUser);

    // Determine if VerifyPrompt should be shown
    if (currentUser && !currentUser.id_uploaded) {
      setShowVerifyPrompt(true);
    } else {
      setShowVerifyPrompt(false);
    }

    // Dynamic import for product suggestions
    import('@/data/products.json')
      .then(module => {
        setSuggestions(module.default.slice(-3).reverse());
      })
      .catch(error => {
        console.error("Failed to load product suggestions:", error);
        setSuggestions([]);
      });

    // Dynamic import for order history
    import('@/data/orders.json')
      .then(module => {
        const allOrders = module.default.filter((order: any) => order.user_email === currentUser?.email);
        const sortedOrders = allOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHasMoreOrders(allOrders.length > 3);
        setOrderHistory(sortedOrders.slice(0, 3));
      })
      .catch(error => {
        console.error("Failed to load order history:", error);
        setOrderHistory([]);
        setHasMoreOrders(false);
      });
  }, []); // Depend on nothing so it only runs once on mount

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-64px)] animate-fadeIn ">

        {/* Welcome Header */}
        {user && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100 animate-slideInUp">
            <div className="flex items-center gap-4">
              {/* Display User Profile Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#E8CEB0] shadow-sm">
                <Image
                  src={user.profileImage || '/default-profile.png'} // Use user.profileImage or a default
                  alt={`${user.name}'s profile`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                  priority // Prioritize loading for visible content
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  Welcome back, <span className="text-[#775522]">{user.name}</span> 👋
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 md:mt-0">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#775522] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:bg-[#5E441B] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 group"
              >
                <FaUserEdit className="text-base group-hover:rotate-6 transition-transform duration-300" />
                Update Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-[#775522] border border-[#775522] rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#E8CEB0] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 group"
              >
                <FaCog className="text-base group-hover:animate-spin-slow transition-transform duration-700" />
                Settings
              </Link>
            </div>
          </div>
        )}

        {/* Verify Prompt - Conditionally rendered */}
        {showVerifyPrompt && <VerifyPrompt />}

        {/* Recent Orders - Now fully responsive */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 text-gray-800">
            <FaBoxOpen className="text-[#775522]" /> Recent Orders
          </h3>
          {orderHistory.length > 0 ? (
            <>
              <ul className="space-y-3 text-sm text-gray-700">
                {orderHistory.map((order, index) => (
                  <li key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gray-100 animate-scaleIn" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                    <div className="flex-grow">
                      <p className="font-semibold text-sm sm:text-base text-gray-800">{order.product}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Order ID: {order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold self-start sm:self-auto ${
                        order.status === 'Delivered'
                          ? 'bg-refurnishBrown-light text-refurnishBrown' // Harmonized: Light brown background, brand brown text
                          : order.status === 'Processing'
                          ? 'bg-yellow-50 text-yellow-800' // Keeping yellow, but softer shades for "Processing" as it's a common convention and less jarring.
                          : 'bg-red-50 text-red-800' // Keeping red, but softer shades for "Cancelled/Failed" for clarity on issues.
                      }`}
                    >
                      {order.status}
                    </span>
                  </li>
                ))}
              </ul>
              {hasMoreOrders && (
                <div className="mt-4 sm:mt-6 text-right">
                  <Link
                    href="/dashboard/orders"
                    className="text-sm sm:text-base text-[#775522] hover:underline font-medium hover:text-[#5E441B] transition-colors duration-200"
                  >
                    View Full History →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic text-sm sm:text-base py-3 sm:py-4 text-center">You have no orders yet. Start shopping now!</p>
          )}
        </div>

        {/* Suggestions - Now fully responsive */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 text-gray-800">
            <FaLightbulb className="text-[#E8CEB0]" /> Things You Might Like
          </h3>
          {suggestions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {suggestions.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 shadow-md bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 animate-scaleIn" style={{ animationDelay: `${0.2 + index * 0.07}s` }}>
                    <div className="relative w-full h-36 sm:h-48 mb-3 sm:mb-4 overflow-hidden rounded-md">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">{item.description || 'No description available.'}</p>
                    <div className="text-sm sm:text-base text-gray-600 mb-2 flex flex-wrap items-center gap-1.5">
                      {item.oldPrice && (
                        <span className="line-through text-gray-400 text-xs sm:text-sm">₦{item.oldPrice.toLocaleString()}</span>
                      )}
                      {/* Harmonized price color */}
                      <span className="text-[#775522] font-bold text-base sm:text-lg">₦{item.price?.toLocaleString()}</span>
                    </div>
                    <Link
                      href={`/shop/${item.id}`}
                      className="mt-1.5 inline-block w-full text-center bg-[#775522] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-[#5E441B] transition-all duration-300 text-xs sm:text-sm font-semibold shadow-md transform hover:scale-105"
                    >
                      View Product
                    </Link>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-[#775522] hover:underline hover:text-[#5E441B] transition-colors duration-200 group"
                >
                  Discover More in Shop <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base italic py-3 sm:py-4 text-center">No new suggestions available at the moment. Check back later!</p>
          )}
        </div>

        {/* Sell Item CTA - Always visible, but adjusted for mobile */}
        <div className="text-center py-4 sm:py-6">
          <Link
            href="/dashboard/sell"
            // Harmonized CTA button color
            className="inline-flex items-center gap-2 sm:gap-3 bg-[#775522] text-white px-5 py-3 sm:px-7 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#5E441B] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse-once"
          >
            <FaPlusCircle className="text-xl sm:text-2xl" />
            Sell an Item
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}