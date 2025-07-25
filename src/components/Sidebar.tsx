'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Dispatch, SetStateAction } from 'react';
import {
  FaHome,
  FaBoxOpen,
  FaCommentDots,
  FaHeart,
  FaListAlt,
  FaPlusCircle,
  FaSignOutAlt,
  FaCog,
  FaEllipsisH, // Icon for 'More'
  FaTimes, // For closing the full-screen overlay
} from 'react-icons/fa';

// Sidebar props - No changes here
interface SidebarProps {
  totalUnreadMessages: number; // This prop will still be passed, but not used visually for count
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ totalUnreadMessages, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  // State to control the full-screen "More" overlay visibility
  const [isMoreOverlayOpen, setIsMoreOverlayOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: FaHome, href: '/dashboard' },
    { name: 'My Orders', icon: FaBoxOpen, href: '/dashboard/orders' },
    { name: 'Messages', icon: FaCommentDots, href: '/dashboard/messages', unreadCount: totalUnreadMessages }, // unreadCount still exists in data, but not rendered
    { name: 'Saved Items', icon: FaHeart, href: '/dashboard/saved-items' },
    { name: 'My Listings', icon: FaListAlt, href: '/dashboard/listings' },
    { name: 'Settings', icon: FaCog, href: '/dashboard/settings' },
    { name: 'Sell an Item', icon: FaPlusCircle, href: '/dashboard/sell', isCallToAction: true },
    { name: 'Logout', icon: FaSignOutAlt, isLogout: true },
  ];

  const bottomBarItems = [
    { name: 'Home', icon: FaHome, href: '/dashboard' },
    { name: 'Orders', icon: FaBoxOpen, href: '/dashboard/orders' },
    { name: 'Messages', icon: FaCommentDots, href: '/dashboard/messages', unreadCount: totalUnreadMessages }, // unreadCount still exists in data, but not rendered
    { name: 'More', icon: FaEllipsisH, action: () => setIsMoreOverlayOpen(true) }, // Special 'More' item
  ];

  const handleLinkClick = () => {
    // Close the full-screen overlay if a link is clicked within it
    setIsMoreOverlayOpen(false);
    // If the parent DashboardLayout also controls a sidebar, you might want to close it too
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar Content (visible always on large screens) */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-full w-64 pt-[94px] bg-white p-6 shadow-xl border-r border-gray-100 flex flex-col justify-between z-40
          lg:translate-x-0 lg:static lg:min-h-screen lg:rounded-r-lg lg:animate-slideInLeft`}
      >
        <div className="flex flex-col">
          {/* Logo/Title for Desktop Sidebar */}
          <div className="mb-8 text-center mt-4">
            <Link
              href="/dashboard"
              className="text-2xl font-extrabold text-[#775522] hover:text-[#5E441B] transition-colors duration-200"
            >
              Your Dashboard
            </Link>
          </div>

          {/* Navigation with text and icons for Desktop Sidebar */}
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
                >
                  <div className="relative flex items-center">
                    <item.icon className={iconClasses} />
                    {/* Removed unread count span */}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div />
      </aside>

      {/* --- */}

      {/* Mobile Bottom Navigation Bar (visible only on small screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#775522] text-white h-16 flex items-center justify-around shadow-lg z-50">
        {bottomBarItems.map((item) => {
          const isActive = item.href && (pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard/home'));
          const itemClasses = `flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors duration-200
            ${isActive ? 'text-[#E8CEB0]' : 'text-white hover:text-gray-200'}`;

          if (item.action) { // For the 'More' button
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={itemClasses}
                aria-label={item.name}
              >
                <item.icon className="text-2xl" />
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href || '#'}
              className={itemClasses}
              onClick={handleLinkClick} // Close overlay if open when navigating
            >
              <div className="relative">
                <item.icon className="text-2xl" />
                {/* Removed unread count span */}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- */}

      {/* Full-Screen "More" Overlay for Mobile */}
      {isMoreOverlayOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[60] flex flex-col items-center py-8 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={() => setIsMoreOverlayOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-700 hover:text-gray-900 text-3xl"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

          {/* Overlay Title */}
          <h2 className="text-3xl font-extrabold text-[#775522] mb-8 mt-4">More Options</h2>

          {/* Navigation Items in Overlay */}
          <nav className="flex flex-col gap-4 w-full px-6">
            {navItems.map((item) => {
              const isActive = item.href && (pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard/home'));

              let linkClasses = 'flex items-center gap-4 px-6 py-3 rounded-lg font-medium text-lg transition-all duration-200 ease-in-out group w-full justify-start';
              let iconClasses = 'text-2xl group-icon-animate';

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
                    className={linkClasses}
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
                  onClick={handleLinkClick}
                >
                  <div className="relative flex items-center">
                    <item.icon className={iconClasses} />
                    {/* Removed unread count span */}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}