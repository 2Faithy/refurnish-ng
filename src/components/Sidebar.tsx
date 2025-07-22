'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  FaHome,
  FaBoxOpen,
  FaCommentDots,
  FaHeart,
  FaListAlt,
  FaPlusCircle,
  FaSignOutAlt,
  FaCog,
} from 'react-icons/fa';
import { FaBarsStaggered } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

// Sidebar props
interface SidebarProps {
  totalUnreadMessages: number;
}

export default function Sidebar({ totalUnreadMessages }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: FaHome, href: '/dashboard' },
    { name: 'My Orders', icon: FaBoxOpen, href: '/dashboard/orders' },
    { name: 'Messages', icon: FaCommentDots, href: '/dashboard/messages', unreadCount: totalUnreadMessages },
    { name: 'Saved Items', icon: FaHeart, href: '/dashboard/saved-items' },
    { name: 'My Listings', icon: FaListAlt, href: '/dashboard/listings' },
    { name: 'Settings', icon: FaCog, href: '/dashboard/settings' },
    { name: 'Sell an Item', icon: FaPlusCircle, href: '/dashboard/sell', isCallToAction: true },
    { name: 'Logout', icon: FaSignOutAlt, isLogout: true },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-150 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-[#775522] text-white rounded-lg shadow-lg hover:bg-[#5E441B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#775522]"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaBarsStaggered className="text-xl" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 h-full w-64 pt-[94px] bg-white p-6 shadow-xl border-r border-gray-100 flex flex-col justify-between z-40
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:min-h-screen lg:rounded-r-lg lg:animate-slideInLeft`}
>
        <div className="flex flex-col">
          {/* Logo */}
          <div className="mb-8 text-center mt-4 lg:mt-0">
            <Link
              href="/dashboard"
              className="text-2xl font-extrabold text-[#775522] hover:text-[#5E441B] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Your Dashboard
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.href && (pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard/home'));

              let linkClasses = 'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out group';
              let iconClasses = 'text-lg group-icon-animate';

              if (item.isLogout) {
                linkClasses += ' text-[#775522] hover:bg-[#F7F1E5]';
                iconClasses += ' text-[#775522]';
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      localStorage.removeItem('currentUser');
                      window.location.href = '/login';
                    }}
                    className={linkClasses + ' w-full text-left'}
                  >
                    <item.icon className={iconClasses} />
                    <span>{item.name}</span>
                  </button>
                );
              }

              if (item.isCallToAction) {
                linkClasses += ' bg-[#775522] text-white shadow-lg hover:bg-[#5E441B] transform hover:scale-[1.02] hover:shadow-xl justify-center';
                iconClasses += ' text-white';
              } else if (isActive) {
                linkClasses += ' bg-[#E8CEB0] text-[#775522] shadow-md border border-[#775522]/20';
                iconClasses += ' text-[#775522]';
              } else {
                linkClasses += ' text-gray-700 hover:bg-gray-100 hover:text-gray-900';
                iconClasses += ' text-gray-500 group-hover:text-gray-700';
              }

              return (
                <Link
                  key={item.name}
                  href={item.href || '#'}
                  className={linkClasses}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative flex items-center">
                    <item.icon className={iconClasses} />
                    {item.name === 'Messages' && item.unreadCount && item.unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-[#775522] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pop leading-none">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div />
      </aside>
    </>
  );
}
