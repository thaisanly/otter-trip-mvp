'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  List, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Filter,
  Users,
  BarChart3
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
}

function SidebarItem({ href, icon, label, count, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          {icon}
        </span>
        {label}
      </div>
      {count !== undefined && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          isActive 
            ? 'bg-blue-200 text-blue-800' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface BookingSidebarProps {
  bookingCounts?: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
}

export default function BookingSidebar({ bookingCounts }: BookingSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/bookings' && pathname === '/bookings') return true;
    if (path !== '/bookings' && pathname.startsWith(path)) return true;
    return false;
  };

  // Default counts if not provided
  const counts = bookingCounts || {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Management</h2>
        
        {/* Overview Section */}
        <SidebarSection title="Overview">
          <SidebarItem
            href="/admin/bookings"
            icon={<List size={18} />}
            label="All Bookings"
            count={counts.total}
            isActive={isActive('/admin/bookings') && !pathname.includes('/search') && !pathname.includes('/analytics')}
          />
          
          <SidebarItem
            href="/admin/bookings/search"
            icon={<Search size={18} />}
            label="Advanced Search"
            isActive={isActive('/admin/bookings/search')}
          />
          
          <SidebarItem
            href="/admin/bookings/analytics"
            icon={<BarChart3 size={18} />}
            label="Analytics"
            isActive={isActive('/admin/bookings/analytics')}
          />
        </SidebarSection>

        {/* Status Filters */}
        <SidebarSection title="By Status">
          <SidebarItem
            href="/admin/bookings?status=pending"
            icon={<Clock size={18} />}
            label="Pending"
            count={counts.pending}
            isActive={pathname.includes('status=pending')}
          />
          
          <SidebarItem
            href="/admin/bookings?status=confirmed"
            icon={<CheckCircle size={18} />}
            label="Confirmed"
            count={counts.confirmed}
            isActive={pathname.includes('status=confirmed')}
          />
          
          <SidebarItem
            href="/admin/bookings?status=completed"
            icon={<CheckCircle size={18} />}
            label="Completed"
            count={counts.completed}
            isActive={pathname.includes('status=completed')}
          />
          
          <SidebarItem
            href="/admin/bookings?status=cancelled"
            icon={<XCircle size={18} />}
            label="Cancelled"
            count={counts.cancelled}
            isActive={pathname.includes('status=cancelled')}
          />
          
          <SidebarItem
            href="/admin/bookings?status=refunded"
            icon={<DollarSign size={18} />}
            label="Refunded"
            count={counts.refunded}
            isActive={pathname.includes('status=refunded')}
          />
        </SidebarSection>

        {/* Quick Filters */}
        <SidebarSection title="Quick Filters">
          <SidebarItem
            href="/admin/bookings?sortBy=createdAt&sortOrder=desc"
            icon={<Calendar size={18} />}
            label="Recent Bookings"
            isActive={pathname.includes('sortBy=createdAt')}
          />
          
          <SidebarItem
            href="/admin/bookings?sortBy=selectedDate&sortOrder=asc"
            icon={<Calendar size={18} />}
            label="Upcoming Tours"
            isActive={pathname.includes('sortBy=selectedDate')}
          />
          
          <SidebarItem
            href="/admin/bookings?sortBy=totalPrice&sortOrder=desc"
            icon={<DollarSign size={18} />}
            label="High Value"
            isActive={pathname.includes('sortBy=totalPrice')}
          />
        </SidebarSection>

        {/* Tools */}
        <SidebarSection title="Tools">
          <SidebarItem
            href="/admin/bookings/bulk-actions"
            icon={<Users size={18} />}
            label="Bulk Actions"
            isActive={isActive('/admin/bookings/bulk-actions')}
          />
          
          <SidebarItem
            href="/admin/bookings/export"
            icon={<Filter size={18} />}
            label="Export Data"
            isActive={isActive('/admin/bookings/export')}
          />
        </SidebarSection>
      </div>
    </div>
  );
}