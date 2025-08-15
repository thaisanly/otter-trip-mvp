'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  LogOut,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  FileText,
  Shield,
  MessageSquare,
  Inbox,
  Calendar,
  Tag,
  Mail,
} from 'lucide-react';

interface AdminSidebarProps {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile, CSS handles desktop
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      description: 'Overview and statistics',
    },
    {
      title: 'Categories',
      icon: Tag,
      href: '/admin/categories',
      description: 'Manage tour categories',
    },
    {
      title: 'Tours',
      icon: FileText,
      href: '/admin/tours',
      description: 'Manage tour packages',
    },
    {
      title: 'Tour Leaders',
      icon: Users,
      href: '/admin/tour-leaders',
      description: 'Manage tour leaders',
    },
    {
      title: 'Experts',
      icon: UserCircle,
      href: '/admin/experts',
      description: 'Manage travel experts',
    },
    {
      title: 'Bookings',
      icon: Calendar,
      href: '/admin/bookings',
      description: 'Manage tour bookings',
    },
    {
      title: 'Consultations',
      icon: MessageSquare,
      href: '/admin/consultations',
      description: 'View consultation bookings',
    },
    {
      title: 'Inquiries',
      icon: Inbox,
      href: '/admin/inquiries',
      description: 'View expert inquiries',
    },
    {
      title: 'Newsletter',
      icon: Mail,
      href: '/admin/newsletters',
      description: 'Manage newsletter subscribers',
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requireSuperAdmin && admin.role !== 'super_admin') {
      return false;
    }
    return true;
  });

  const isActiveRoute = (href: string) => {
    // Check if current path starts with the menu href (handles detail pages)
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static z-50 h-full transition-transform duration-300 ease-in-out lg:transition-none`}
      >
        <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-gray-400">OtterTrip</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-800">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <UserCircle size={32} className="text-gray-400" />
                <div className="text-left">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-gray-400">
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isProfileOpen && (
              <div className="mt-2 py-2 bg-gray-800 rounded-lg">
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-200 truncate">{admin.email}</p>
                </div>
                <hr className="my-2 border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                const isDisabled = item.disabled;

                return (
                  <li key={item.title}>
                    <button
                      onClick={() => !isDisabled && router.push(item.href)}
                      disabled={isDisabled}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isDisabled
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{item.title}</p>
                        {isDisabled && (
                          <p className="text-xs text-gray-500">Coming soon</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>© 2024 OtterTrip</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`${
          isSidebarOpen ? 'hidden' : 'block'
        } fixed top-4 left-4 z-40 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg`}
      >
        <Menu size={24} />
      </button>
    </>
  );
}